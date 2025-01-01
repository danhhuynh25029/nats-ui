package jetstream

import (
	"github.com/gin-gonic/gin"
)

type Router struct {
	handler *Handler
}

func NewRouter(handler *Handler) Router {
	return Router{handler}
}

func (u *Router) UseRoute(r *gin.RouterGroup) {
	group := r.Group("/jetstream")
	group.POST("/messages", u.handler.GetMessageFromJetStream)
	group.GET("/streams", u.handler.GetAllStream)
	group.POST("/keys", u.handler.GetBucketKeys)
	group.GET("/buckets", u.handler.GetAllBuckets)
	group.POST("/publish", u.handler.PublishMessage)
	group.POST("/streams/create", u.handler.CreateStream)
	group.POST("/buckets/create", u.handler.CreateBucket)
	group.POST("/keys/create", u.handler.CreateKey)
}
