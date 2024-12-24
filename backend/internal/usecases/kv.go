package usecases

import (
	"context"
	"log"
	"nats-ui/internal/model"
	"nats-ui/pkg"
)

func (j JetStreamSVC) GetListKeyOfBucket(ctx context.Context) ([]model.KeyValue, error) {

	_, js, err := pkg.PrepareJSHelper()
	if err != nil {
		return nil, err
	}

	store, err := js.KeyValue(ctx, "mykv")
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
	return resp, nil
}
