package models

import "github.com/google/uuid"

type User struct {
	UserID       uuid.UUID `json:"user_id"`
	UserName     string    `json:"username"`
	UserEmail    string    `json:"email"`
	IsRegistered bool      `json:"is_registered"`
	IsAdmin      bool      `json:"is_admin"`
}
