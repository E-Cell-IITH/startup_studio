package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
)



func testRoute(c* gin.Context){

	c.JSON(http.StatusOK,gin.H{
		"message" : "test",
	})

}


func SetUpRoutes(router *gin.Engine){

	router.GET("/test",testRoute)


}