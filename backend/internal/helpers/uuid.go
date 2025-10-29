package helpers

import (
	"crypto/sha256"

	"github.com/google/uuid"
)

func GenerateUUID(randomstring string) (string, error) {
	hash := sha256.New()
	hash.Write([]byte(randomstring))
	hashed := hash.Sum(nil)

	truncatedHash := hashed[:16]

	newUUID, err := uuid.FromBytes(truncatedHash)
	if err != nil {
		return "", err
	}

	return newUUID.String(), nil
}