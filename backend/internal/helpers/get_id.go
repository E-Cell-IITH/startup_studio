package helpers

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/E-Cell-IITH/startup_studio/config"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GetUserOrMentorId(c *gin.Context) {
	userId := c.Param("userId")

	var startupId uuid.UUID
	var mentorId uuid.UUID

	// find the startup or mentor id using user id
	queryStartUp :=
		`
	SELECT startup_id from startups WHERE user_id = $1
	`
	ctx := c.Request.Context()

	err := config.DB.QueryRow(ctx, queryStartUp, userId).Scan(&startupId)


	if err != nil && err != sql.ErrNoRows {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to fetch startup id",
		})
		return
	}



	// if startup id exists return from here
	if startupId != uuid.Nil {
		c.JSON(http.StatusOK, gin.H{
			"message":    "Found startup id for the user",
			"startup_id": startupId,
		})
		return
	}


	// startup id not found check for mentor

	queryMentor :=
		`
	SELECT mentor_id from mentors WHERE user_id = $1
	`
	err = config.DB.QueryRow(ctx, queryMentor, userId).Scan(&mentorId)
	if err != nil && err != sql.ErrNoRows{
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to fetch mentor id",
		})
		return
	}



	// send response
	if mentorId != uuid.Nil {
		c.JSON(http.StatusOK, gin.H{
			"message":   "Found mentor id for the user",
			"mentor_id": mentorId,
		})
		return
	}


	log.Println("Mentor Not found")

}
