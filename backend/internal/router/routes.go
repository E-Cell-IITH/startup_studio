package router

import (
	"net/http"

	"github.com/E-Cell-IITH/startup_studio/internal/controllers"
	"github.com/gin-gonic/gin"
)



func testRoute(c* gin.Context){

	c.JSON(http.StatusOK,gin.H{
		"message" : "test",
	})

}


func SetUpRoutes(router *gin.Engine){

	router.GET("/test",testRoute)

	auth := router.Group("/api/auth")
	auth.POST("/login",controllers.Login)
	auth.GET("/logout",controllers.LogOut)


}