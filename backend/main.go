package main

import (
	"os"

	"github.com/E-Cell-IITH/startup_studio/config"
	"github.com/E-Cell-IITH/startup_studio/internal/router"
)

// init function
func init() {
	config.Init()
}

func main() {

	// router setup
	r := router.SetUpRouter()

	PORT := os.Getenv("PORT")

	defer config.DB.Close()

	if PORT == "" {
		PORT = "8000"
	}

	r.Run(":" + PORT)

}
