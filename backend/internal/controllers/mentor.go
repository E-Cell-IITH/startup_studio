package controllers

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/E-Cell-IITH/startup_studio/config"
	"github.com/E-Cell-IITH/startup_studio/internal/models"
	"github.com/gin-gonic/gin"
)

// ✅ Get all mentors
func GetAllMentors(c *gin.Context) {
	ctx := c.Request.Context()

	query := `
		SELECT mentor_id, user_id, mentor_name, phone_number,
		       linked_in_url, profile_photo_ref, COALESCE(about, '')
		FROM mentors
		WHERE approval_status = $1;
	`

	rows, err := config.DB.QueryContext(ctx, query,true)
	if err != nil {
		log.Println("error fetching mentors:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not fetch mentors"})
		return
	}
	defer rows.Close()

	var mentors []models.MentorDetail

	for rows.Next() {
		var m models.Mentor
		var mentorID string

		err := rows.Scan(&mentorID, &m.UserID, &m.MentorName, &m.Phone, &m.LinkedInURL, &m.ProfilePic, &m.About)
		if err != nil {
			log.Println("error scanning mentor row:", err)
			continue
		}

		mDetail := models.MentorDetail{Mentor: m}

		// Expertise
		expRows, err := config.DB.QueryContext(ctx, `SELECT expertise FROM mentor_expertise WHERE mentor_id = $1`, mentorID)
		if err == nil {
			defer expRows.Close()
			for expRows.Next() {
				var exp string
				if err := expRows.Scan(&exp); err == nil {
					mDetail.Expertise = append(mDetail.Expertise, exp)
				}
			}
		} else {
			log.Println("error fetching expertise:", err)
		}

		// Experience
		experienceRows, err := config.DB.QueryContext(ctx, `SELECT experience FROM experience WHERE mentor_id = $1`, mentorID)
		if err == nil {
			defer experienceRows.Close()
			for experienceRows.Next() {
				var exp string
				if err := experienceRows.Scan(&exp); err == nil {
					mDetail.Experience = append(mDetail.Experience, exp)
				}
			}
		} else {
			log.Println("error fetching experience:", err)
		}

		// Mentorships
		msRows, err := config.DB.QueryContext(ctx, `
			SELECT m.mentorship_id, s.startup_name
			FROM mentorships m
			JOIN startups s ON m.startup_id = s.startup_id
			WHERE m.mentor_id = $1
		`, mentorID)
		if err == nil {
			defer msRows.Close()
			for msRows.Next() {
				var ms models.MentorshipInfo
				if err := msRows.Scan(&ms.MentorshipID, &ms.StartupName); err == nil {
					mDetail.Mentorships = append(mDetail.Mentorships, ms)
				}
			}
		} else {
			log.Println("error fetching mentorships:", err)
		}

		mentors = append(mentors, mDetail)
	}

	if err := rows.Err(); err != nil {
		log.Println("iteration error in mentors:", err)
	}

	c.JSON(http.StatusOK, gin.H{"mentors": mentors})
}

// ✅ Get single mentor by ID
func GetMentorByID(c *gin.Context) {
	ctx := c.Request.Context()
	mentorID := c.Param("id")

	query := `
		SELECT mentor_id, user_id, mentor_name, phone_number,
		       linked_in_url, profile_photo_ref, approval_status, COALESCE(about, '')
		FROM mentors
		WHERE mentor_id = $1;
	`

	var m models.Mentor
	var id string
	err := config.DB.QueryRowContext(ctx, query, mentorID).
		Scan(&id, &m.UserID, &m.MentorName, &m.Phone, &m.LinkedInURL, &m.ProfilePic, &m.ApprovalStatus, &m.About)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "mentor not found"})
		} else {
			log.Println("error fetching mentor:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not fetch mentor"})
		}
		return
	}

	mDetail := models.MentorDetail{Mentor: m}

	// Expertise
	expRows, err := config.DB.QueryContext(ctx, `SELECT expertise FROM mentor_expertise WHERE mentor_id = $1`, id)
	if err == nil {
		defer expRows.Close()
		for expRows.Next() {
			var exp string
			if err := expRows.Scan(&exp); err == nil {
				mDetail.Expertise = append(mDetail.Expertise, exp)
			}
		}
	} else {
		log.Println("error fetching expertise:", err)
	}

	// Experience
	experienceRows, err := config.DB.QueryContext(ctx, `SELECT experience FROM experience WHERE mentor_id = $1`, id)
	if err == nil {
		defer experienceRows.Close()
		for experienceRows.Next() {
			var exp string
			if err := experienceRows.Scan(&exp); err == nil {
				mDetail.Experience = append(mDetail.Experience, exp)
			}
		}
	} else {
		log.Println("error fetching experience:", err)
	}

	// Mentorships
	msRows, err := config.DB.QueryContext(ctx, `
		SELECT m.mentorship_id, s.startup_name
		FROM mentorships m
		JOIN startups s ON m.startup_id = s.startup_id
		WHERE m.mentor_id = $1
	`, id)
	if err == nil {
		defer msRows.Close()
		for msRows.Next() {
			var ms models.MentorshipInfo
			if err := msRows.Scan(&ms.MentorshipID, &ms.StartupName); err == nil {
				mDetail.Mentorships = append(mDetail.Mentorships, ms)
			}
		}
	} else {
		log.Println("error fetching mentorships:", err)
	}

	c.JSON(http.StatusOK, gin.H{"mentor": mDetail})
}
