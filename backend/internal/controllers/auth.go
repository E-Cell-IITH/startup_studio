package controllers

import (
	"database/sql"
	"fmt"

	"log"
	"net/http"
	"os"

	"github.com/E-Cell-IITH/startup_studio/config"
	"github.com/E-Cell-IITH/startup_studio/internal/helpers"
	"github.com/E-Cell-IITH/startup_studio/internal/models"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/idtoken"
)

type LoginContent struct {
	ID string `json:"idToken"`
}

var clientID string = os.Getenv("GOOGLE_CLIENT_ID")

func Login(c *gin.Context) {
	// get id token and email
	var loginRequest LoginContent
	if err := c.ShouldBindBodyWithJSON(&loginRequest); err != nil {
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
	var is_registered bool
	query := `SELECT id, full_name, is_registered FROM users WHERE email = $1`
	err = config.DB.QueryRowContext(ctx, query, emailStr).Scan(&id, &name, &is_registered)

	if err != nil {
		if err == sql.ErrNoRows {
			// insert user if not found
			uuidStr, err := helpers.GenerateUUIDFromEmail(emailStr)
			if err != nil {
				log.Printf("Failed to generate uuid: %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
				return
			}

			insertQuery := `INSERT INTO users (id, full_name, email,is_registered) VALUES ($1, $2, $3,$4) RETURNING id, full_name`
			err = config.DB.QueryRowContext(ctx, insertQuery, uuidStr, fullName, emailStr, false).Scan(&id, &name)
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
		false,       // httpOnly -> change this to true in production
	)
	// return successful login response

	c.JSON(http.StatusOK, gin.H{
		"message":       "Login Successfull",
		"id":            id,
		"is_registered": is_registered,
	})

}

func StartupRegistration(c *gin.Context) {

	// get the startup from frontend
	var startup models.Startup

	err := c.ShouldBindBodyWithJSON(&startup)

	// validate the startup content
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request payload"})
		return
	}

	// get the user id
	userId := startup.UserID

	if userId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "User ID is required"})
		return
	}

	// generate a new uuid for startups
	uuidStr, err := helpers.GenerateUUIDFromEmail(userId)
	if err != nil {
		log.Printf("Failed to generate uuid: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		return
	}

	// insert everything to that user
	query := `
    INSERT INTO startups
	(startup_id, user_id, startup_name, industry, website, profile_photo_ref,phone_number) 
	VALUES 
	($1,$2,$3,$4,$5,$6,$7)
	`

	ctx := c.Request.Context()

	_, err = config.DB.ExecContext(ctx, query,
		uuidStr,
		userId,
		startup.StartupName,
		startup.Industry,
		startup.Website,
		startup.ProfilePic,
		startup.Phone,
	)

	if err != nil {
		log.Printf("Error in registering startup: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		return
	}

	// update the user to is registered
	updateToRegistered := `
    UPDATE users
	SET is_registered = TRUE
	WHERE id = $1;
	`

	_, err = config.DB.ExecContext(ctx, updateToRegistered, userId)

	if err != nil {
		log.Printf("Error in  updating user's registration status: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		return
	}

	// send response
	c.JSON(http.StatusOK, gin.H{
		"message":       "Login Successfull",
		"id":            userId,
		"startup_id":    uuidStr,
		"is_registered": true,
	})

}

func MentorRegistration(c *gin.Context) {

	var mentorRequest models.Mentor

	err := c.ShouldBindBodyWithJSON(&mentorRequest)

	if err != nil {
		log.Fatal("Failed to parse mentor")
	}

	fmt.Println(mentorRequest)

}

func Logout(c *gin.Context) {

	// set cookie life 0

}
