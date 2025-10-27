package controllers

import (
	"log"
	"net/http"

	"github.com/E-Cell-IITH/startup_studio/config"
	"github.com/E-Cell-IITH/startup_studio/internal/db"
	"github.com/gin-gonic/gin"
)

// GetAllNonApprovedMentors fetches all mentors pending admin approval
func GetAllNonApprovedMentors(c *gin.Context) {
	userID := c.Param("userId")
	requestEmail, _ := c.Get("email")

	ctx := c.Request.Context()
	var isAdmin bool
	var dbEmail string

	query := `SELECT is_admin, email FROM users WHERE id = $1;`
	if err := config.DB.QueryRowContext(ctx, query, userID).Scan(&isAdmin, &dbEmail); err != nil {
		log.Println("user check error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error."})
		return
	}

	if requestEmail != dbEmail {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Unauthorized access attempt detected."})
		return
	}
	if !isAdmin {
		c.JSON(http.StatusForbidden, gin.H{"message": "You are not an admin"})
		return
	}

	mentors, err := db.GetAllNonApprovedMentors(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch mentors"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"mentors": mentors})
}

// ApproveAMentor marks a mentor as approved
func ApproveAMentor(c *gin.Context) {
	adminUserID := c.Param("adminUserId")
	requestEmail, _ := c.Get("email")

	ctx := c.Request.Context()
	var isAdmin bool
	var dbEmail string

	if err := config.DB.QueryRowContext(ctx, `SELECT is_admin, email FROM users WHERE id = $1;`, adminUserID).Scan(&isAdmin, &dbEmail); err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error."})
		return
	}
	if requestEmail != dbEmail {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Unauthorized access attempt detected."})
		return
	}
	if !isAdmin {
		c.JSON(http.StatusForbidden, gin.H{"message": "You are not an admin"})
		return
	}

	mentorUserID := c.Param("mentorUserId")

	if err := db.ApproveMentor(ctx, mentorUserID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to approve mentor"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Mentor approved successfully"})
}

// RejectMentor deletes a mentor's user account
func RejectMentor(c *gin.Context) {
	adminUserID := c.Param("adminUserId")
	requestEmail, _ := c.Get("email")

	ctx := c.Request.Context()
	var isAdmin bool
	var dbEmail string

	if err := config.DB.QueryRowContext(ctx, `SELECT is_admin, email FROM users WHERE id = $1;`, adminUserID).Scan(&isAdmin, &dbEmail); err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error."})
		return
	}
	if requestEmail != dbEmail {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Unauthorized access attempt detected."})
		return
	}
	if !isAdmin {
		c.JSON(http.StatusForbidden, gin.H{"message": "You are not an admin"})
		return
	}

	mentorUserID := c.Param("mentorUserId")

	if err := db.RejectMentor(ctx, mentorUserID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to reject mentor"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Mentor rejected and user deleted successfully"})
}

// Get all non approved startups
func GetAllNonApprovedStartups(c *gin.Context) {
	userID := c.Param("userId")
	requestEmail, _ := c.Get("email")

	ctx := c.Request.Context()
	var isAdmin bool
	var dbEmail string

	query := `SELECT is_admin, email FROM users WHERE id = $1;`
	if err := config.DB.QueryRowContext(ctx, query, userID).Scan(&isAdmin, &dbEmail); err != nil {
		log.Println("user check error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error."})
		return
	}

	if requestEmail != dbEmail {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Unauthorized access attempt detected."})
		return
	}
	if !isAdmin {
		c.JSON(http.StatusForbidden, gin.H{"message": "You are not an admin"})
		return
	}

	

	

}
