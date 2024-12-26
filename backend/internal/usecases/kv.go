package usecases

import (
	"context"
	"fmt"
	"github.com/dustin/go-humanize"
	"github.com/nats-io/jsm.go"
	"github.com/nats-io/nats.go"
	"log"
	"nats-ui/internal/model"
	"nats-ui/pkg"
	"strings"
	"time"
)

func (j JetStreamSVC) GetListKeyOfBucket(ctx context.Context, req model.GetKeysReq) (*model.GetKeysResp, error) {

	_, js, err := pkg.PrepareJSHelper()
	if err != nil {
		return nil, err
	}

	fmt.Println(req)

	store, err := js.KeyValue(ctx, req.Bucket)
	if err != nil {
		return nil, err
	}
	keys, err := store.Keys(ctx)
	if err != nil {
		log.Printf("Error getting mykv keys: %s", err.Error())
		return nil, err
	}
	var resp []model.KeyValue
	for _, v := range keys {
		res, err := store.Get(ctx, v)
		if err != nil {
			log.Printf("Error getting mykv key %s: %s", v, err.Error())
			continue
		}
		resp = append(resp, model.KeyValue{
			Key:   v,
			Value: string(res.Value()),
		})
	}
	return &model.GetKeysResp{
		Keys:  resp,
		Total: len(resp),
	}, nil
}

func (j JetStreamSVC) GetListBucket(ctx context.Context) ([]model.Stream, error) {
	var found []*jsm.Stream
	url := "nats://localhost:4222"
	nc, err := nats.Connect(url)
	if err != nil {
		log.Fatalf("cannot connect nats %v", err)
	}
	mgr, _ := jsm.New(nc, jsm.WithTimeout(10*time.Second))
	_, err = mgr.EachStream(nil, func(s *jsm.Stream) {
		if s.IsKVBucket() {
			found = append(found, s)
		}
	})
	if err != nil {
		log.Printf("Error getting bucket %v", err)
		return nil, err
	}

	if len(found) == 0 {
		log.Printf("No bucket found")
		return nil, nil
	}
	var resp []model.Stream
	for _, v := range found {
		if v.IsKVBucket() {
			var consumers []model.Consumer
			_, err := v.EachConsumer(func(consumer *jsm.Consumer) {
				consumers = append(consumers, model.Consumer{Name: consumer.Name()})
			})
			if err != nil {
				log.Println(err)
			}
			nfo, _ := v.LatestInformation()
			name := strings.Split(v.Name(), "_")
			s := model.Stream{
				Name:         strings.Join(name[1:], ""),
				Size:         humanize.IBytes(nfo.State.Bytes),
				TotalMessage: nfo.State.Msgs,
				Created:      nfo.Created.Local(),
				LastMessage:  pkg.SinceRefOrNow(nfo.TimeStamp, nfo.State.LastTime).String(),
				Consumers:    consumers,
			}
			resp = append(resp, s)
		}
	}
	return resp, nil
}
