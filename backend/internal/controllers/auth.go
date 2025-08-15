package controllers

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"os/exec"

	"github.com/E-Cell-IITH/startup_studio/config"
	"github.com/E-Cell-IITH/startup_studio/internal/helpers"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/idtoken"
)

type LoginContent struct {
	ID    string
	Email string
}

var clientID string = os.Getenv("GOOGLE_CLIENT_ID")

func Login(c *gin.Context) {
	// get id token and email
	var loginRequest LoginContent
	if err := c.BindJSON(&loginRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request payload"})
		return
	}

	idTokenFrontend := loginRequest.ID
	ctx := c.Request.Context()

	// verify id token
	payload, err := idtoken.Validate(ctx, idTokenFrontend, clientID)
	if err != nil {
		log.Printf("Token validation failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		return
	}

	emailStr, ok := payload.Claims["email"].(string)
	if !ok {
		log.Printf("Email claim missing in token payload")
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		return
	}

	fullName, _ := payload.Claims["name"].(string)

	// check if the user exists
	var id string
	var name string
	query := `SELECT id, full_name FROM users WHERE email = $1`
	err = config.DB.QueryRowContext(ctx, query, emailStr).Scan(&id, &name)

	if err != nil {
		if err == sql.ErrNoRows {
			// insert user if not found
			newUUID, err := exec.Command("uuidgen").Output()
			if err != nil {
				log.Printf("Failed to generate uuid: %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
				return
			}
			insertQuery := `INSERT INTO users (id, full_name, email) VALUES ($1, $2, $3) RETURNING id, full_name`
			err = config.DB.QueryRowContext(ctx, insertQuery, newUUID, fullName, emailStr).Scan(&id, &name)
			if err != nil {
				log.Printf("Failed to insert user: %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
				return
			}
		} else {
			log.Printf("Error checking user: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
			return
		}
	}

	// generate jwt token

	token, err := helpers.GenerateToken(emailStr)

	if err != nil {
		log.Printf("Failed to generate token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
	}
	c.SetCookie(
		"token",     // name
		token,       // value
		48*60*60,    // maxAge in seconds (24 hours)
		"/",         // path
		"localhost", // domain -> change this to domain name in production
		false,       // secure (true = only over HTTPS) -> true in production 
		false,        // httpOnly -> change this to true in production
	)
	// return successful login response

	c.JSON(http.StatusOK,gin.H{
		"message" : "Login Successfull",
	})


}

func Logout(c *gin.Context) {

	// set cookie life 0



}
