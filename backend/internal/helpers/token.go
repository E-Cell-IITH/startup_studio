package helpers

import (
	"fmt"
	"os"
	"strconv"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
)

func GenerateToken(email string) (string, error) {
	tokenLifespanStr := os.Getenv("TOKEN_HOUR_LIFESPAN")
	if tokenLifespanStr == "" {
		return "", fmt.Errorf("TOKEN_HOUR_LIFESPAN environment variable not set")
	}
	token_lifespan, err := strconv.Atoi(tokenLifespanStr)
	if err != nil {
		return "", fmt.Errorf("invalid TOKEN_HOUR_LIFESPAN value: %v", err)
	}
	claims := jwt.MapClaims{}

	claims["authorized"] = true
	claims["email"] = email
	claims["exp"] = time.Now().Add(time.Hour * time.Duration(token_lifespan)).Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))

}
