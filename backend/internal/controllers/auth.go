package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {

	c.JSON(http.StatusOK, gin.H{
		"message" : "hello from login",
	})


}


func LogOut(c* gin.Context){

}