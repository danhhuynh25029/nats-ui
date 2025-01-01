package jetstream

import (
	"github.com/gin-gonic/gin"
	"nats-ui/internal/model"
	"nats-ui/internal/usecases"
	"net/http"
)

type Handler struct {
	JetStreamUseCase *usecases.JetStreamUseCase
}

func NewJetStreamHandler(useCase *usecases.JetStreamUseCase) *Handler {
	return &Handler{
		JetStreamUseCase: useCase,
	}
}

func (u *Handler) GetMessageFromJetStream(ctx *gin.Context) {
	var req model.GetMessageFromJetStreamRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resp, err := u.JetStreamUseCase.GetMessageFromJetStream(ctx, req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, resp)
}

func (u *Handler) GetAllStream(ctx *gin.Context) {
	resp := u.JetStreamUseCase.GetAllStream()
	ctx.JSON(http.StatusOK, resp)
}

func (u *Handler) GetAllBuckets(ctx *gin.Context) {
	resp, err := u.JetStreamUseCase.GetListBucket(ctx)
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
	keys, err := u.JetStreamUseCase.GetListKeyOfBucket(ctx, req)
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
	err := u.JetStreamUseCase.PublishMessage(ctx, req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, nil)
}

func (u *Handler) CreateStream(ctx *gin.Context) {
	var req model.CreateStreamReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := u.JetStreamUseCase.CreateStream(ctx, req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, nil)
}

func (u *Handler) CreateBucket(ctx *gin.Context) {
	var req model.CreateBucket
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := u.JetStreamUseCase.CreateBucket(ctx, req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, nil)
}

func (u *Handler) CreateKey(ctx *gin.Context) {
	var req model.CreateKeyReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := u.JetStreamUseCase.CreateKey(ctx, req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, nil)
}
