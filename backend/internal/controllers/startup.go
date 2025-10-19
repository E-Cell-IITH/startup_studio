package controllers

import (
	"net/http"

	"github.com/E-Cell-IITH/startup_studio/internal/db"
	"github.com/gin-gonic/gin"
)

func GetAllStartUps(c *gin.Context) {
	ctx := c.Request.Context()

	startups, err := db.GetAllStartups(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not fetch startups"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"startups": startups})
}