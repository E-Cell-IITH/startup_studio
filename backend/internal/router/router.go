package router

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetUpRouter() *gin.Engine {
	gin.SetMode(gin.DebugMode)
	router := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"} 
	config.AllowHeaders = []string{
		"Origin",
		"Content-Type", 
		"Accept",
		"Authorization",
		"X-Requested-With",
		"Access-Control-Allow-Origin",
		"Access-Control-Allow-Headers",
		"Access-Control-Allow-Methods",
	}
	config.AllowCredentials = true
	config.ExposeHeaders = []string{"Content-Length", "Content-Type"} 
	router.Use(cors.New(config))

	SetUpRoutes(router)

	return router
}
