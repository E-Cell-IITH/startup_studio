package config

import (
	"log"

	"github.com/joho/godotenv"
)

// load env
func LoadEnv(){
	err := godotenv.Load()
	if err != nil {
		log.Fatal(".env file failed to load!")
	}else {
		log.Println("Loaded .env file")
	}

}