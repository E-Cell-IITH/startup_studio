package router

import (
	"net/http"

	"github.com/E-Cell-IITH/startup_studio/internal/controllers"
	"github.com/E-Cell-IITH/startup_studio/internal/helpers"
	"github.com/E-Cell-IITH/startup_studio/internal/middlewares"
	"github.com/gin-gonic/gin"
)

func testRoute(c *gin.Context) {

	c.JSON(http.StatusOK, gin.H{
		"message": "test",
	})

}

func SetUpRoutes(router *gin.Engine) {

	router.GET("/test", testRoute)

	auth := router.Group("/api/auth")
	auth.POST("/login", controllers.Login)
	auth.GET("/logout", controllers.Logout)

	auth.Use(middlewares.AuthMiddleware)
	{
		// presigned url route
		auth.GET("/generate-presign", helpers.GetPresignedURL)
		// get user id or mentor id
		auth.GET("/getId/:userId", helpers.GetUserOrMentorId)
		auth.POST("/startup-registration", controllers.StartupRegistration)
		auth.POST("/mentor-registration", controllers.MentorRegistration)

		// profile route
		auth.GET("/me", controllers.GetUserDetails)
	}

	mentor := router.Group("/api/mentors")

	mentor.Use(middlewares.AuthMiddleware)
	{
		mentor.GET("/", controllers.GetAllMentors)
	}

	startup := router.Group("/api/startups")

	startup.Use(middlewares.AuthMiddleware)
	{
		startup.GET("/", controllers.GetAllStartUps)
	}

	admin := router.Group("/api/admin")

	admin.Use(middlewares.AuthMiddleware)
	{
		admin.GET("/mentors/approval/:userId", controllers.GetAllNonApprovedMentors)
		admin.PATCH("/mentor/approve/:adminUserId/:mentorUserId", controllers.ApproveAMentor)
		admin.DELETE("/mentor/reject/:adminUserId/:mentorUserId", controllers.RejectMentor)
	}

}
