package controllers

import (
	"net/http"

	"github.com/E-Cell-IITH/startup_studio/internal/db"
	"github.com/gin-gonic/gin"
)

func GetAllMentors(c *gin.Context) {
	ctx := c.Request.Context()

	mentors, err := db.GetAllMentors(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not fetch mentors"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"mentors": mentors})
}
