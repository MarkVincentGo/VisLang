package main

import (
	"context"
	"log"
//	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
//	"go.mongodb.org/mongo-driver/mongo/options"
	//"go.mongodb.org/mongo-driver/mongo/readpref"
)

// Program ... struct for program to go in db
type Program struct {
	Name string `json:”name,omitempty”`
	Components string `json:”components,omitempty”`
}

// InsertProgram ... inserts program into database
func InsertProgram(client *mongo.Client, name string, components string) {
	program := Program{name, components}
	collection := client.Database("VLANG").Collection("programs")
	insertResult, err := collection.InsertOne(context.TODO(), program)

	if err != nil {
		log.Fatal(err)
	}

	log.Println(insertResult);
}


// GetProgram ... get a program from database
func GetProgram(client *mongo.Client, name string) Program {

	collection := client.Database("VLANG").Collection("programs")


	filter := bson.M{"name": name}
	
	var program Program
	
	err := collection.FindOne(context.TODO(), filter).Decode(&program)
	
	if err != nil {
		log.Fatal(err)
	}
	
	
	log.Println("Found post with title ", program.Name, program.Components)
	return program
	
	}