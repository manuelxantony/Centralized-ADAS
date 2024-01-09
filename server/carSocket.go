package main

import (
	"log"

	"github.com/gorilla/websocket"
)

type carSocket struct {
	// websocket for the car
	socket *websocket.Conn
	// for sending clients message
	send chan []byte
	// group of car in an area
	carPool *carPool
}

// reads messages from socket via ReadMessage method
// and sends the message into the forward channel of the room
// basically reads message from every clients who is writing to the socket
func (c *carSocket) read() {
	defer c.socket.Close()
	for {
		_, msg, err := c.socket.ReadMessage()
		if err != nil {
			log.Print(err)
			return
		}
		c.carPool.forward <- msg
	}
}

// write method allows clients to write messages to the socket
// so every message type by the client will be write to the socket and read by read method
func (c *carSocket) write() {
	defer c.socket.Close()
	for msg := range c.send {
		err := c.socket.WriteMessage(websocket.TextMessage, msg)
		log.Printf("car messages: %s", msg)
		if err != nil {
			log.Print(err)
			return
		}
	}
}
