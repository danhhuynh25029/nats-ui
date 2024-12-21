package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"nats-ui/delivery/http/jetstream"
	"nats-ui/usecases"
)

func main() {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Content-Type", "Authorization", "X-Requested-With"},
	}))
	group := r.Group("/api")

	jetStreamSVC := usecases.NewJetStreamSVC()
	jetStreamHandler := jetstream.NewJetStreamHandler(jetStreamSVC)
	jetStreamRouter := jetstream.NewRouter(jetStreamHandler)
	jetStreamRouter.UseRoute(group)

	r.Run() // listen and serve on 0.0.0.0:8080
}
