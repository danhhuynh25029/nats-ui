package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	jetstream2 "nats-ui/internal/delivery/http/jetstream"
	"nats-ui/internal/ui"
	"nats-ui/internal/usecases"
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
	jetStreamHandler := jetstream2.NewJetStreamHandler(jetStreamSVC)
	jetStreamRouter := jetstream2.NewRouter(jetStreamHandler)
	jetStreamRouter.UseRoute(group)

	ui.AddRoutes(r)
	r.Run() // listen and serve on 0.0.0.0:8080
}
