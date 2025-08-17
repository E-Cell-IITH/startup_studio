package router

import (
	"github.com/E-Cell-IITH/startup_studio/internal/middleware"
	"github.com/gin-gonic/gin"
)

func SetUpRouter() *gin.Engine {

	gin.SetMode(gin.DebugMode)
	router := gin.Default()
	router.Use(middleware.CORSMiddleware())

	SetUpRoutes(router)

	return router

}
