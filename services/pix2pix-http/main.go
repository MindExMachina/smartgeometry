package main

import (
	"fmt"

	"github.com/Sirupsen/logrus"
	"github.com/joho/godotenv"
)

var (
	log = logrus.WithField("cmd", "pix2pix-http")
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// You can get your network ip with the following helper
	// Useful for other devices on your network to connect to you
	//fmt.Println("Your network ip is: " + Get() + "")

	// Start server at the host specified in the environment file
	fmt.Println(fmt.Sprintf("Starting server at %s...", Env("HOST")+":"+Env("PORT")))

	MakeRoutes()

}
