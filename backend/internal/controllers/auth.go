package controllers

import (
	"errors"
	"log"
	"net/http"
	"os"

	"github.com/E-Cell-IITH/startup_studio/internal/db"
	"github.com/E-Cell-IITH/startup_studio/internal/helpers"
	"github.com/E-Cell-IITH/startup_studio/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"google.golang.org/api/idtoken"
)

type LoginContent struct {
	ID string `json:"idToken"`
}

var clientID string = os.Getenv("GOOGLE_CLIENT_ID")

func Login(c *gin.Context) {
	var loginRequest LoginContent
	if err := c.ShouldBindBodyWithJSON(&loginRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request payload"})
		return
	}

	idTokenFrontend := loginRequest.ID
	ctx := c.Request.Context()

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

	// Fetch or insert user
	user, err := db.GetUserByEmail(ctx, emailStr)
	if err != nil {
		if err == pgx.ErrNoRows {
			user, err = db.InsertUser(ctx, fullName, emailStr)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
				return
			}
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
			return
		}
	}

	token, err := helpers.GenerateToken(emailStr)
	if err != nil {
		log.Printf("Failed to generate token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		return
	}

	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie("token", token, 48*60*60, "/", "", true, true)

	c.JSON(http.StatusOK, gin.H{
		"message":       "Login Successful",
		"user_id":       user.UserID,
		"is_registered": user.IsRegistered,
		"email" : user.UserEmail,
	})
}

func StartupRegistration(c *gin.Context) {
	var startup models.StartupRegistration

	if err := c.ShouldBindBodyWithJSON(&startup); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request payload"})
		return
	}

	if startup.UserID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "User ID is required"})
		return
	}

	ctx := c.Request.Context()

	startupID, err := db.InsertStartup(ctx, startup)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		return
	}

	err = db.MarkUserAsRegistered(ctx, startup.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":       "startup registration successful",
		"id":            startup.UserID,
		"startup_id":    startupID,
		"is_registered": true,
	})
}

func MentorRegistration(c *gin.Context) {
	var mentor models.Mentor

	if err := c.ShouldBindJSON(&mentor); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request payload"})
		return
	}

	if mentor.UserID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "User ID is required"})
		return
	}

	ctx := c.Request.Context()

	// Fetch mentor's name from users table
	name, err := db.GetUserNameByID(ctx, mentor.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		return
	}
	mentor.MentorName = name

	// Insert mentor
	mentorID, err := db.InsertMentor(ctx, mentor)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		return
	}

	// Insert experience and expertise
	db.InsertMentorExperience(ctx, mentorID, mentor.Experience)
	db.InsertMentorExpertise(ctx, mentorID, mentor.Expertise)

	// Mark user as registered
	if err := db.MarkUserAsRegistered(ctx, mentor.UserID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		return
	}

	// Send response
	c.JSON(http.StatusOK, gin.H{
		"message":   "Mentor registration submitted. Pending admin approval.",
		"user_id":   mentor.UserID,
		"mentor_id": mentorID,
	})
}

func Logout(c *gin.Context) {

	// set cookie life 0
	c.SetCookie(
		"token",
		"",
		-1,
		"/",         // path
		"localhost", // domain → leave empty for localhost
		false,       // secure → must be true in production (HTTPS)
		false,       // httpOnly → true in production
	)

	// return successful login response

	c.JSON(http.StatusOK, gin.H{
		"message": "Logout Successfull",
	})

}

func GetUserDetails(c *gin.Context) {
	var resp models.UserResponse
	ctx := c.Request.Context()

	// get email from middleware 
	emailVal, exists := c.Get("email")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "email not found in token"})
		return
	}
	email, ok := emailVal.(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email format in token"})
		return
	}

	// fetch user info
	currUser, err := db.GetUserDetailsByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not fetch user"})
		}
		return
	}
	resp.User = *currUser
	// log.Println(resp.User)

	// check if user is a startup
	startup, startupID, err := db.GetStartupByUserID(ctx, currUser.UserID.String())
	if err == nil {
		sDetail := models.StartupDetail{StartupResponse: *startup}
		sDetail.Mentorships, _ = db.GetStartupMentorships(ctx, startupID)
		resp.StartupDetail = &sDetail
		// log.Println(resp)
		c.JSON(http.StatusOK, resp)
		return
	} else{
		log.Println(err)
	}

	// check if user is a mentor
	mentor, mentorID, err := db.GetMentorByUserID(ctx, currUser.UserID.String())
	if err == nil {
		mDetail := models.MentorDetail{Mentor:	 *mentor}
		mDetail.Expertise = db.GetMentorExpertise(ctx, mentorID)
		mDetail.Experience = db.GetMentorExperience(ctx, mentorID)
		mDetail.Mentorships = db.GetMentorMentorships(ctx, mentorID)
		resp.MentorDetail = &mDetail
		// log.Println(resp)
		c.JSON(http.StatusOK, resp)
		return
	}


	// fallback: just return user info
	c.JSON(http.StatusOK, resp)
}
