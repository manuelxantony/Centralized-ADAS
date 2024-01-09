package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/manuelxantony/Centralized-ADAS/server/models"
)

func main() {
	server := gin.Default()

	server.Use(corsMiddleware())

	server.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, "pong")
	})
	server.POST("/car/register", RegisterCarHandler)

	err := server.Run(":8080")

	if err != nil {
		log.Fatalf("server start error: %s", err)
	}

}

func RegisterCarHandler(ctx *gin.Context) {
	var car models.Car
	ctx.BindJSON(&car)

	log.Printf("car added with id %s", car.ID)

	ctx.JSON(http.StatusOK, "car added")

}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
