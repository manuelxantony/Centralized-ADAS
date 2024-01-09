package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type carPool struct {
	// holds the incomming messages, that forward to the other clients
	forward chan []byte
	// channel for clients to join the room
	join chan *carSocket
	//channel for clients who wish to leave the room
	leave chan *carSocket
	// holds all current clients in the room
	clients map[*carSocket]struct{} // use struct{}{} instead of bool

	// holds the messages for the room
	messages [][]byte // should be a db reference
}

func NewCarPool() *carPool {
	return &carPool{
		forward:  make(chan []byte),
		join:     make(chan *carSocket),
		leave:    make(chan *carSocket),
		clients:  make(map[*carSocket]struct{}),
		messages: make([][]byte, 0), // should be a db operation
	}
}

const (
	SOCKET_BUFFER_SIZE  = 1024
	MESSAGE_BUFFER_SIZE = 256
)

var upgrader = &websocket.Upgrader{
	ReadBufferSize:  SOCKET_BUFFER_SIZE,
	WriteBufferSize: SOCKET_BUFFER_SIZE,
}

func (cp *carPool) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	// not needed in production
	// use dev and prod flag
	// enable this only when dev flag is used
	// allows samehosts in server and client
	upgrader.CheckOrigin = func(r *http.Request) bool {
		return true
	}
	//

	//Upgrade upgrades the HTTP server connection to the WebSocket protocol.
	socket, err := upgrader.Upgrade(w, req, nil)
	if err != nil {
		log.Fatal(err)
	}

	client := &carSocket{
		socket:  socket,
		send:    make(chan []byte, MESSAGE_BUFFER_SIZE),
		carPool: cp,
	}
	cp.join <- client

	defer func() { cp.leave <- client }()

	go client.write()
	client.read()
}

func (cp *carPool) Run() {
	log.Println("Running car pool")
	for {
		select {
		case client := <-cp.join:
			// client joining
			cp.clients[client] = struct{}{}
			log.Printf("car joined: %+v", client)
			if len(cp.messages) > 0 {
				for _, msg := range cp.messages {
					client.send <- msg
				}
			}
		case client := <-cp.leave:
			// client leaving
			delete(cp.clients, client)
			log.Printf("car left: %+v", client)
		case msg := <-cp.forward:
			// forward message to all cars in the pool
			cp.messages = append(cp.messages, msg)
			for client := range cp.clients {
				client.send <- msg
			}

		}
	}
}
