package model

import "time"

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
	Created      time.Time  `json:"created"`
	LastMessage  string     `json:"last_message"`
	Consumers    []Consumer `json:"consumers"`
}

type Consumer struct {
	Name string `json:"name"`
}
