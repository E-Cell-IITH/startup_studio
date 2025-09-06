package controllers

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/E-Cell-IITH/startup_studio/config"
	"github.com/E-Cell-IITH/startup_studio/internal/models"
	"github.com/gin-gonic/gin"
)

func GetAllStartUps(c *gin.Context) {
	ctx := c.Request.Context()
	query := `
		SELECT s.startup_id,
		       s.user_id,
		       s.startup_name,
		       s.website,
		       s.phone_number,
		       s.profile_photo_ref,
		       COALESCE(s.about, '')
		FROM startups s
		JOIN users u ON s.user_id = u.id
		WHERE u.is_admin = false
	`

	rows, err := config.DB.QueryContext(ctx, query)
	if err != nil {
		log.Println("error fetching startups:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not fetch startups"})
		return
	}
	defer rows.Close()

	var startups []models.StartupDetail

	for rows.Next() {
		var startupID string
		var s models.Startup

		err := rows.Scan(
			&startupID,
			&s.UserID,
			&s.StartupName,
			&s.Website,
			&s.Phone,
			&s.ProfilePic,
			&s.About,
		)
		if err != nil {
			log.Println("error scanning startup row:", err)
			continue
		}

		sDetail := models.StartupDetail{Startup: s}

		// fetch mentorships for startup
		func() {
			ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
			defer cancel()

			mentorshipQuery := `
				SELECT m.mentorship_id, u.full_name
				FROM mentorships m
				JOIN mentors me ON m.mentor_id = me.mentor_id
				JOIN users u ON me.user_id = u.id
				WHERE m.startup_id = $1
			`

			msRows, err := config.DB.QueryContext(ctx, mentorshipQuery, startupID)
			if err != nil {
				log.Println("error fetching startup mentorships:", err)
				return
			}
			defer msRows.Close()

			for msRows.Next() {
				var ms models.MentorshipInfo
				if err := msRows.Scan(&ms.MentorshipID, &ms.MentorName); err != nil {
					log.Println("error scanning mentorship row:", err)
					continue
				}
				sDetail.Mentorships = append(sDetail.Mentorships, ms)
			}

			if err := msRows.Err(); err != nil {
				log.Println("iteration error in mentorships:", err)
			}
		}()

		startups = append(startups, sDetail)
	}

	if err := rows.Err(); err != nil {
		log.Println("iteration error in startups:", err)
	}

	c.JSON(http.StatusOK, gin.H{"startups": startups})
}
