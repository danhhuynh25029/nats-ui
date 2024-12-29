package jetstream

import (
	"github.com/gin-gonic/gin"
	"nats-ui/internal/model"
	"nats-ui/internal/usecases"
	"net/http"
)

type Handler struct {
	JetStreamBiz *usecases.JetStreamSVC
}

func NewJetStreamHandler(useCase *usecases.JetStreamSVC) *Handler {
	return &Handler{
		JetStreamBiz: useCase,
	}
}

func (u *Handler) GetMessageFromJetStream(ctx *gin.Context) {
	var req model.GetMessageFromJetStreamRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resp, err := u.JetStreamBiz.GetMessageFromJetStream(ctx, req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, resp)
}

func (u *Handler) GetAllStream(ctx *gin.Context) {
	resp := u.JetStreamBiz.GetAllStream()
	ctx.JSON(http.StatusOK, resp)
}

func (u *Handler) GetAllBuckets(ctx *gin.Context) {
	resp, err := u.JetStreamBiz.GetListBucket(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, resp)
}

func (u *Handler) GetBucketKeys(ctx *gin.Context) {
	var req model.GetKeysReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	keys, err := u.JetStreamBiz.GetListKeyOfBucket(ctx, req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, keys)
}

func (u *Handler) PublishMessage(ctx *gin.Context) {
	var req model.PublishMessageReq

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := u.JetStreamBiz.PublishMessage(ctx, req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, nil)
}
