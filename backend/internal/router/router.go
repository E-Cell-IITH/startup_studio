package router

import (
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetUpRouter() *gin.Engine {
	gin.SetMode(gin.DebugMode)
	router := gin.Default()

	origins := os.Getenv("ALLOWED_ORIGINS")
	allowedOrigins := strings.Split(origins, ",")

	config := cors.DefaultConfig()
	config.AllowOrigins = allowedOrigins
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"} 
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
