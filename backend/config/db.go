package config

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/lib/pq" // don't forget to add it. It doesn't be added automatically
)

// connect with db
var DB *sql.DB

func ConnectDatabase() {

	DB_URL := os.Getenv("DB_URL")
	if DB_URL == ""{
		log.Fatal("DB_URL not found")
	}
	db, errSql := sql.Open("postgres", DB_URL)
	if errSql != nil {
		log.Fatal("Connection to Failed")
	} else {
		DB = db
		log.Println("Successfully connected to database!")
	}
}
