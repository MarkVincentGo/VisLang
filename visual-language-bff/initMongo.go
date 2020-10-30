package main

import (
	"context"
	"log"
	"time"

// 	"github.com/gofiber/fiber"
// 	//"go.mongodb.org/mongo-driver/bson"
   "go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
// 	//"go.mongodb.org/mongo-driver/mongo/readpref"
)


//InitMongo ... initializes mongoDB
func InitMongo() *mongo.Client {
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://localhost:27017/VLANG"))
	if err != nil {
		log.Fatal(err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("mongo init")
	
	log.Println("createdDB")
	
	//defer client.Disconnect(ctx)
	return client
}