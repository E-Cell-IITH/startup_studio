package helpers

import (
	"crypto/sha256"

	"github.com/google/uuid"
)

func GenerateUUIDFromEmail(emailStr string) (string, error) {
	hash := sha256.New()
	hash.Write([]byte(emailStr))
	hashed := hash.Sum(nil)

	truncatedHash := hashed[:16]

	newUUID, err := uuid.FromBytes(truncatedHash)
	if err != nil {
		return "", err
	}

	return newUUID.String(), nil
}