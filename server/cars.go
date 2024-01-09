package main

import (
	"github.com/gin-gonic/gin"
)

type Car struct {
	// this car's ID
	CarID string
	// ID's of all the cars
	CarIDs []string
	// car pool map
	// we can have multiple cars pool, this can be based on any parameters
	// lets say cars going in same route or cars in same location
	// or priority cars such as ambulance or police vehicle.. like that
	CarPoolMap map[string]*carPool
}

func NewCar(carId string) *Car {
	return &Car{
		CarID:      carId,
		CarIDs:     make([]string, 0),
		CarPoolMap: make(map[string]*carPool),
	}
}

func (c *Car) ServeCar(ctx *gin.Context) {
	// room id from request // get
	// add room to room id if not available in roomMap

	car, ok := c.CarPoolMap[c.CarID]
	if !ok {
		car = NewCarPool()
		c.CarPoolMap[c.CarID] = car
		c.CarIDs = append(c.CarIDs, c.CarID)
	}
	go car.Run()
	car.ServeHTTP(ctx.Writer, ctx.Request)
}
