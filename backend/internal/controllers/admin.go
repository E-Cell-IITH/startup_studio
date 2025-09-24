package controllers

import (
	"log"
	"net/http"

	"github.com/E-Cell-IITH/startup_studio/db"
	"github.com/gin-gonic/gin"
)

func GetAllNonApprovedMentors(c *gin.Context) {
	// get the user id from params
	userId := c.Param("userId")

	requestEmail, _ := c.Get("email")

	// check if the person is admin or not
	var isAdmin bool
	var dbEmail string

	ctx := c.Request.Context()
	isAdmin, dbEmail, err := db.GetDetailsByID(ctx, userId)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error."})
		return
	}

	if requestEmail != dbEmail {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Hey, I too have some brain."})
		return
	}

	if !isAdmin {
		c.JSON(http.StatusBadRequest, gin.H{"message": "You are not an admin"})
		return
	}

	// query to fetch all non-approved mentors
	mentors, err := db.GetAllNonApprovedMentors(ctx)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error."})
	}

	// respond with all non-approved mentors
	c.JSON(http.StatusOK, gin.H{
		"mentors": mentors,
	})
}

func ApproveAMentor(c *gin.Context) {
	adminUserId := c.Param("adminUserId")
	requestEmail, _ := c.Get("email")

	var isAdmin bool
	var dbEmail string
	var err error

	ctx := c.Request.Context()

	isAdmin, dbEmail, err = db.GetDetailsByID(ctx, adminUserId)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error."})
		return
	}

	if requestEmail != dbEmail {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Hey, I too have some brain."})
		return
	}

	if !isAdmin {
		c.JSON(http.StatusForbidden, gin.H{"message": "You are not an admin"})
		return
	}

	// get the mentor user id from params
	mentorUserId := c.Param("mentorUserId")

	// get the mentor id from mentorUserId
	err = db.ApproveMentor(ctx, mentorUserId)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to approve mentor."})
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mentor approved successfully",
	})
}

func RejectMentor(c *gin.Context) {
	adminUserId := c.Param("adminUserId")

	requestEmail, _ := c.Get("email")

	var isAdmin bool
	var dbEmail string
	var err error

	ctx := c.Request.Context()
	isAdmin, dbEmail, err = db.GetDetailsByID(ctx, adminUserId)

	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error."})
		return
	}

	if requestEmail != dbEmail {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Hey, I too have some brain."})
		return
	}

	if !isAdmin {
		c.JSON(http.StatusForbidden, gin.H{"message": "You are not an admin"})
		return
	}

	// get mentor user id from params
	mentorUserId := c.Param("mentorUserId")

	// delete user
	err = db.RejectMentor(ctx, mentorUserId)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to reject mentor"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mentor rejected and user deleted successfully",
	})
}
