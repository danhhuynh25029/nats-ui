package model

type GetMessageFromJetStreamRequest struct {
	StreamName string `json:"stream_name" binding:"required"`
}

type Message struct {
	Sequence uint64 `json:"sequence"`
	Data     string `json:"data"`
	Subject  string `json:"subject"`
	Received string `json:"received"`
	Reply    string `json:"reply"`
}

type GetMessageFromJetStreamResponse struct {
	Messages []Message `json:"messages"`
	Total    uint64    `json:"total"`
}

type Stream struct {
	Name         string     `json:"name"`
	TotalMessage uint64     `json:"total_message"`
	Size         string     `json:"size"`
	Created      string     `json:"created"`
	LastMessage  string     `json:"last_message"`
	Consumers    []Consumer `json:"consumers"`
}

type Consumer struct {
	Name string `json:"name"`
}

type KeyValue struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

type GetKeysReq struct {
	Bucket string `json:"bucket"`
}

type Key struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

type GetKeysResp struct {
	Keys  []KeyValue `json:"keys"`
	Total int        `json:"total"`
}

type PublishMessageReq struct {
	Stream  string `json:"stream"`
	Subject string `json:"subject"`
	Message string `json:"message"`
}

type CreateStreamReq struct {
	StreamName string `json:"stream_name"`
	// TODO : support subject list
	Subject string `json:"subject"`
	Storage int    `json:"storage"`
}

type CreateBucket struct {
	BucketName string `json:"bucket_name"`
}

type CreateKeyReq struct {
	BucketName string `json:"bucket_name"`
	Key        string `json:"key"`
	Value      string `json:"value"`
}
