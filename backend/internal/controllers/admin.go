package controllers

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/E-Cell-IITH/startup_studio/config"
	"github.com/E-Cell-IITH/startup_studio/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

func GetAllNonApprovedMentors(c *gin.Context) {
	// get the user id from params
	userId := c.Param("userId")

	// check if the person is admin or not
	var isAdmin bool

	queryUser := `
		SELECT is_admin FROM users WHERE id = $1;
	`

	ctx := c.Request.Context()
	err := config.DB.QueryRowContext(ctx, queryUser, userId).Scan(&isAdmin)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error."})
		return
	}

	if !isAdmin {
		c.JSON(http.StatusBadRequest, gin.H{"message": "You are not an admin"})
		return
	}

	// query to fetch all non-approved mentors
	queryMentors := `
		    SELECT 
			m.user_id,
			m.phone_number,
			m.profile_photo_ref,
			m.linked_in_url,
			m.about,
			m.approval_status,
			m.mentor_name,
			COALESCE(ARRAY_AGG(DISTINCT e.experience) FILTER (WHERE e.experience IS NOT NULL), '{}') AS experiences,
			COALESCE(ARRAY_AGG(DISTINCT ex.expertise) FILTER (WHERE ex.expertise IS NOT NULL), '{}') AS expertises
			FROM mentors m
			LEFT JOIN experience e ON m.mentor_id = e.mentor_id
			LEFT JOIN mentor_expertise me ON m.mentor_id = me.mentor_id
			LEFT JOIN expertise ex ON me.expertise_id = ex.expertise_id
			WHERE m.approval_status = FALSE
			GROUP BY m.mentor_id;
		`

	rows, err := config.DB.QueryContext(ctx, queryMentors)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch mentors"})
		return
	}
	defer rows.Close()

	var mentors []models.Mentor

	for rows.Next() {
		var mentor models.Mentor
		var experiences, expertises []sql.NullString

		err := rows.Scan(
			&mentor.UserID,
			&mentor.Phone,
			&mentor.ProfilePic,
			&mentor.LinkedInURL,
			&mentor.About,
			&mentor.ApprovalStatus,
			&mentor.MentorName,
			pq.Array(&experiences),
			pq.Array(&expertises),
		)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Error scanning mentor data"})
			return
		}

		// convert []sql.NullString -> []string
		for _, exp := range experiences {
			if exp.Valid {
				mentor.Experience = append(mentor.Experience, exp.String)
			}
		}
		for _, ex := range expertises {
			if ex.Valid {
				mentor.Expertise = append(mentor.Expertise, ex.String)
			}
		}

		mentors = append(mentors, mentor)
	}

	// respond with all non-approved mentors
	c.JSON(http.StatusOK, gin.H{
		"mentors": mentors,
	})
}

func ApproveAMentor(c *gin.Context) {
	userId := c.Param("userId")

	// check if user is admin
	var isAdmin bool
	queryUser := `SELECT is_admin FROM users WHERE id = $1;`

	ctx := c.Request.Context()
	err := config.DB.QueryRowContext(ctx, queryUser, userId).Scan(&isAdmin)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error."})
		return
	}

	if !isAdmin {
		c.JSON(http.StatusForbidden, gin.H{"message": "You are not an admin"})
		return
	}

	// get mentorId
	mentorId := c.Param("mentorId")

	// update mentor approval
	queryUpdate := `UPDATE mentors SET approval_status = TRUE WHERE mentor_id = $1`
	_, err = config.DB.ExecContext(ctx, queryUpdate, mentorId)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to approve mentor"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mentor approved successfully",
	})
}

func RejectMentor(c *gin.Context) {
	userId := c.Param("userId")

	var isAdmin bool
	queryUser := `SELECT is_admin FROM users WHERE id = $1;`

	ctx := c.Request.Context()
	err := config.DB.QueryRowContext(ctx, queryUser, userId).Scan(&isAdmin)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error."})
		return
	}

	if !isAdmin {
		c.JSON(http.StatusForbidden, gin.H{"message": "You are not an admin"})
		return
	}

	mentorId := c.Param("mentorId")

	// find mentor's user_id
	var mentorUserId string
	queryMentorUserId := `SELECT user_id FROM mentors WHERE mentor_id = $1`
	err = config.DB.QueryRowContext(ctx, queryMentorUserId, mentorId).Scan(&mentorUserId)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch mentor"})
		return
	}

	// delete user 
	queryDelete := `DELETE FROM users WHERE id = $1`
	_, err = config.DB.ExecContext(ctx, queryDelete, mentorUserId)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to reject mentor"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mentor rejected and user deleted successfully",
	})
}
