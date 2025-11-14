package config

import (
	"context"
	"log"
	"os"
	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func ConnectDatabase() {
	DB_URL := os.Getenv("DB_URL")
	if DB_URL == "" {
		log.Fatal("DB_URL not found")
	}

	pool, err := pgxpool.New(context.Background(), DB_URL)
	if err != nil {
		log.Fatalf("Unable to create connection pool: %v", err)
	}

	// Test the connection
	err = pool.Ping(context.Background())
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}

	DB = pool
	log.Println("Successfully connected to database!")
}