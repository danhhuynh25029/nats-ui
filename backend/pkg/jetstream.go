package pkg

import (
	"fmt"
	"github.com/choria-io/fisk"
	"github.com/nats-io/jsm.go"
	"github.com/nats-io/jsm.go/natscontext"
	"github.com/nats-io/nats.go"
	"github.com/nats-io/nats.go/jetstream"
	"log"
	"os"
	"strings"
	"sync"
)

func prepareHelperUnlocked(servers string, copts ...nats.Option) (*nats.Conn, *jsm.Manager, error) {
	var err error

	opts := DefaultOptions

	if opts.Config == nil {
		err = loadContext(false)
		if err != nil {
			return nil, nil, err
		}
	}

	if opts.Conn == nil {
		opts.Conn, err = newNatsConnUnlocked(servers, copts...)
		if err != nil {
			return nil, nil, err
		}
	}

	if opts.Mgr != nil {
		return opts.Conn, opts.Mgr, nil
	}

	jsopts := []jsm.Option{
		jsm.WithAPIPrefix(opts.Config.JSAPIPrefix()),
		jsm.WithEventPrefix(opts.Config.JSEventPrefix()),
		jsm.WithDomain(opts.Config.JSDomain()),
	}

	//if os.Getenv("NOVALIDATE") == "" {
	//	jsopts = append(jsopts, jsm.WithAPIValidation(validator()))
	//}

	if opts.Timeout != 0 {
		jsopts = append(jsopts, jsm.WithTimeout(opts.Timeout))
	}

	if opts.Trace {
		jsopts = append(jsopts, jsm.WithTrace())
	}

	opts.Mgr, err = jsm.New(opts.Conn, jsopts...)
	if err != nil {
		return nil, nil, err
	}

	return opts.Conn, opts.Mgr, err
}

func newNatsConnUnlocked(servers string, copts ...nats.Option) (*nats.Conn, error) {
	opts := DefaultOptions

	if opts.Conn != nil {
		return opts.Conn, nil
	}

	if opts.Config == nil {
		err := loadContext(false)
		if err != nil {
			return nil, err
		}
	}

	if servers == "" {
		servers = opts.Config.ServerURL()
	}

	var err error

	opts.Conn, err = nats.Connect(servers, copts...)

	return opts.Conn, err
}

var SkipContexts bool

func loadContext(softFail bool) error {
	opts := DefaultOptions

	ctxOpts := []natscontext.Option{
		natscontext.WithServerURL(opts.Servers),
		natscontext.WithCreds(opts.Creds),
		natscontext.WithNKey(opts.Nkey),
		natscontext.WithCertificate(opts.TlsCert),
		natscontext.WithKey(opts.TlsKey),
		natscontext.WithCA(opts.TlsCA),
		natscontext.WithSocksProxy(opts.SocksProxy),
		natscontext.WithJSEventPrefix(opts.JsEventPrefix),
		natscontext.WithJSAPIPrefix(opts.JsApiPrefix),
		natscontext.WithJSDomain(opts.JsDomain),
		natscontext.WithInboxPrefix(opts.InboxPrefix),
		natscontext.WithColorScheme(opts.ColorScheme),
	}

	if opts.TlsFirst {
		ctxOpts = append(ctxOpts, natscontext.WithTLSHandshakeFirst())
	}

	if opts.Username != "" && opts.Password == "" {
		ctxOpts = append(ctxOpts, natscontext.WithToken(opts.Username))
	} else {
		ctxOpts = append(ctxOpts, natscontext.WithUser(opts.Username), natscontext.WithPassword(opts.Password))
	}

	var err error

	exist, _ := fileAccessible(opts.CfgCtx)

	if exist && strings.HasSuffix(opts.CfgCtx, ".json") {
		opts.Config, err = natscontext.NewFromFile(opts.CfgCtx, ctxOpts...)
	} else {
		opts.Config, err = natscontext.New(opts.CfgCtx, !SkipContexts, ctxOpts...)
	}

	if err != nil && softFail {
		opts.Config, err = natscontext.New(opts.CfgCtx, false, ctxOpts...)
	}

	return err
}

func fileAccessible(f string) (bool, error) {
	stat, err := os.Stat(f)
	if err != nil {
		return false, err
	}

	if stat.IsDir() {
		return false, fmt.Errorf("is a directory")
	}

	file, err := os.Open(f)
	if err != nil {
		return false, err
	}
	file.Close()

	return true, nil
}

var mu sync.Mutex

func PrepareJSHelper() (*nats.Conn, jetstream.JetStream, error) {
	mu.Lock()
	defer mu.Unlock()

	var err error
	opts := Options{}

	//if opts.Conn == nil {
	//	opts.Conn, _, err = prepareHelperUnlocked("", natsOpts()...)
	//	if err != nil {
	//		return nil, nil, err
	//	}
	//}
	url := "nats://localhost:4222"
	conn, err := nats.Connect(url)
	if err != nil {
		log.Printf("error connecting to nats: %v", err)
		return nil, nil, err
	}
	opts.Conn = conn
	if opts.JSc != nil {
		return opts.Conn, opts.JSc, nil
	}
	opts.JSc, err = jetstream.New(opts.Conn)
	if err != nil {
		return nil, nil, err
	}
	return opts.Conn, opts.JSc, nil
}

func opts() *Options {
	return DefaultOptions
}

func natsOpts() []nats.Option {
	if opts().Config == nil {
		return []nats.Option{}
	}

	copts, err := opts().Config.NATSOptions()
	fisk.FatalIfError(err, "configuration error")

	connectionName := strings.TrimSpace(opts().ConnectionName)
	if len(connectionName) == 0 {
		connectionName = "NATS CLI Version " + ""
	}

	return append(copts, []nats.Option{
		nats.Name(connectionName),
		nats.MaxReconnects(-1),
		nats.ConnectHandler(func(conn *nats.Conn) {
			if opts().Trace {
				log.Printf(">>> Connected to %s", conn.ConnectedUrlRedacted())
			}
		}),
		nats.DiscoveredServersHandler(func(conn *nats.Conn) {
			if opts().Trace {
				log.Printf(">>> Discovered new servers, known servers are now %s", strings.Join(conn.Servers(), ", "))
			}
		}),
		nats.DisconnectErrHandler(func(nc *nats.Conn, err error) {
			if err != nil {
				log.Printf("Disconnected due to: %s, will attempt reconnect", err)
			}
		}),
		nats.ReconnectHandler(func(nc *nats.Conn) {
			log.Printf("Reconnected [%s]", nc.ConnectedUrl())
		}),
		nats.ErrorHandler(func(nc *nats.Conn, _ *nats.Subscription, err error) {
			url := nc.ConnectedUrl()
			if url == "" {
				log.Printf("Unexpected NATS error: %s", err)
			} else {
				log.Printf("Unexpected NATS error from server %s: %s", nc.ConnectedUrlRedacted(), err)
			}
		}),
	}...)
}
