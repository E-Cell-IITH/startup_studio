package router

import (
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetUpRouter() *gin.Engine {

	gin.SetMode(gin.DebugMode)
	router := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{os.Getenv("WEB_URL")}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}
	config.AllowHeaders = []string{"*"}
	config.AllowHeaders = []string{"Content-Type"}
	config.AllowHeaders = []string{"X-Requested-With", "Content-Type", "Accept"}
	config.AllowCredentials = true
	router.Use(cors.New(config))

	SetUpRoutes(router)

	return router

}
