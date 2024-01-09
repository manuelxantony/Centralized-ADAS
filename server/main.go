package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {

	server := gin.Default()

	server.Use(corsMiddleware())

	server.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, "pong")
	})
	server.GET("/car/register/:id", RegisterCarHandler)

	err := server.Run(":8080")

	if err != nil {
		log.Fatalf("server start error: %s", err)
	}

}

// this fucnction will register the car (now just printing)
// and calls to open a websocket connection
func RegisterCarHandler(ctx *gin.Context) {

	carID := ctx.Param("id")

	log.Printf("car added with id %s", carID)

	// other db operation can be done here
	// such are adding car ids to db...
	car := NewCar(carID)
	car.ServeCar(ctx)

	//ctx.JSON(http.StatusOK, "car added")

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
