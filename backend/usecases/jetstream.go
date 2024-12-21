package usecases

import (
	"context"
	"fmt"
	"github.com/dustin/go-humanize"
	"github.com/nats-io/jsm.go"
	"github.com/nats-io/nats.go"
	"log"
	"nats-ui/model"
	"nats-ui/pkg"
	"time"
)

type JetStreamSVC struct {
}

func NewJetStreamSVC() *JetStreamSVC {
	return &JetStreamSVC{}
}

func (j JetStreamSVC) GetMessageFromJetStream(ctx context.Context, req model.GetMessageFromJetStreamRequest) (*model.GetMessageFromJetStreamResponse, error) {
	url := "nats://localhost:4222"
	nc, err := nats.Connect(url)
	if err != nil {
		log.Printf("cannot connect nats %v \n", err)
		return nil, err
	}
	mgr, _ := jsm.New(nc, jsm.WithTimeout(10*time.Second))
	str, err := mgr.LoadStream(req.StreamName)
	if err != nil {
		log.Printf("cannot load stream %v \n", err)
		return nil, err
	}

	pops := []jsm.PagerOption{
		jsm.PagerSize(3),
	}

	pgr, err := str.PageContents(pops...)
	if err != nil {
		log.Fatal(err)
	}
	defer pgr.Close()
	var messages []model.Message
	for {
		var messageResp model.Message
		msg, last, err := pgr.NextMsg(context.Background())
		if err != nil {
			log.Fatal(err)
		}
		meta, err := jsm.ParseJSMsgMetadata(msg)
		if err == nil {
			messageResp.Received = meta.TimeStamp().Format(time.RFC3339)
			messageResp.Subject = msg.Subject
			messageResp.Sequence = meta.StreamSequence()
			//fmt.Printf("[%d] Subject: %s Received: %s\n", meta.StreamSequence(), msg.Subject, meta.TimeStamp().Format(time.RFC3339))
		} else {
			messageResp.Subject = msg.Subject
			messageResp.Reply = msg.Reply
			//fmt.Printf("Subject: %s Reply: %s\n", msg.Subject, msg.Reply)
		}
		messageResp.Data = string(msg.Data)
		messages = append(messages, messageResp)
		if last {
			return &model.GetMessageFromJetStreamResponse{
				Messages: messages,
				Total:    uint64(len(messages)),
			}, nil
		}
	}

	return &model.GetMessageFromJetStreamResponse{
		Messages: messages,
		Total:    uint64(len(messages)),
	}, nil
}

func (j JetStreamSVC) GetAllStream() []model.Stream {
	var filter *jsm.StreamNamesFilter

	var streams []*jsm.Stream
	var names []string

	skipped := false
	url := "nats://localhost:4222"
	nc, err := nats.Connect(url)
	if err != nil {
		log.Fatalf("cannot connect nats %v", err)
	}
	mgr, _ := jsm.New(nc, jsm.WithTimeout(10*time.Second))
	missing, err := mgr.EachStream(filter, func(s *jsm.Stream) {
		streams = append(streams, s)
		names = append(names, s.Name())
	})
	if err != nil {
		log.Println(err)
	}

	if len(streams) == 0 && skipped {
		fmt.Println("No Streams defined, pass -a to include system streams")

	} else if len(streams) == 0 {
		fmt.Println("No Streams defined")

	}
	var resp []model.Stream
	for _, v := range streams {
		var consumers []model.Consumer
		_, err := v.EachConsumer(func(consumer *jsm.Consumer) {
			consumers = append(consumers, model.Consumer{Name: consumer.Name()})
		})
		if err != nil {
			log.Println(err)
		}
		nfo, _ := v.LatestInformation()
		s := model.Stream{
			Name:         v.Name(),
			Size:         humanize.IBytes(nfo.State.Bytes),
			TotalMessage: nfo.State.Msgs,
			Created:      nfo.Created.Local(),
			LastMessage:  pkg.SinceRefOrNow(nfo.TimeStamp, nfo.State.LastTime).String(),
			Consumers:    consumers,
		}
		resp = append(resp, s)
	}

	fmt.Println(missing)
	return resp
}
