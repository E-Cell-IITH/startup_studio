package main

import (
	"os"

	"github.com/E-Cell-IITH/startup_studio/internal/router"
)


// init function 

func main() {



	// router setup
	r := router.SetUpRouter()

	PORT := os.Getenv("PORT")

	if PORT == "" {
		PORT = "8000"
	}



	r.Run(":" + PORT)

}
