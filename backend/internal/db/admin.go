package db

import (
	"context"
	"log"

	"github.com/E-Cell-IITH/startup_studio/config"
	"github.com/E-Cell-IITH/startup_studio/internal/models"
	"github.com/google/uuid"
	"github.com/lib/pq"
)

// GetAllNonApprovedMentors fetches mentors pending admin approval.
func GetAllNonApprovedMentors(ctx context.Context) ([]models.Mentor, error) {
	query := `
		SELECT 
			m.user_id,
			m.phone_number,
			m.linked_in_url,
			m.about,
			m.approval_status,
			m.mentor_name,
			COALESCE(ARRAY_AGG(DISTINCT e.experience) FILTER (WHERE e.experience IS NOT NULL), '{}') AS experiences,
			COALESCE(ARRAY_AGG(DISTINCT me.expertise) FILTER (WHERE me.expertise IS NOT NULL), '{}') AS expertises
		FROM mentors m
		LEFT JOIN experience e ON m.mentor_id = e.mentor_id
		LEFT JOIN mentor_expertise me ON m.mentor_id = me.mentor_id
		WHERE m.approval_status = FALSE
		GROUP BY m.mentor_id;
	`

	rows, err := config.DB.QueryContext(ctx, query)
	if err != nil {
		log.Println("error fetching non-approved mentors:", err)
		return nil, err
	}
	defer rows.Close()

	var mentors []models.Mentor

	for rows.Next() {
		var mentor models.Mentor
		var experiences, expertises []string

		if err := rows.Scan(
			&mentor.UserID,
			&mentor.Phone,
			&mentor.LinkedInURL,
			&mentor.About,
			&mentor.ApprovalStatus,
			&mentor.MentorName,
			pq.Array(&experiences),
			pq.Array(&expertises),
		); err != nil {
			log.Println("error scanning mentor row:", err)
			continue
		}

		mentor.Experience = experiences
		mentor.Expertise = expertises
		mentors = append(mentors, mentor)
	}

	return mentors, nil
}

// ApproveMentor updates a mentor's approval status to true
func ApproveMentor(ctx context.Context, mentorUserID string) error {
	var mentorID uuid.UUID
	querySelect := `SELECT mentor_id FROM mentors WHERE user_id = $1`

	if err := config.DB.QueryRowContext(ctx, querySelect, mentorUserID).Scan(&mentorID); err != nil {
		log.Println("error finding mentor:", err)
		return err
	}

	queryUpdate := `UPDATE mentors SET approval_status = TRUE WHERE mentor_id = $1`
	if _, err := config.DB.ExecContext(ctx, queryUpdate, mentorID); err != nil {
		log.Println("error updating mentor approval:", err)
		return err
	}

	return nil
}

// RejectMentor deletes a mentor user entirely (rejects their application)
func RejectMentor(ctx context.Context, mentorUserID string) error {
	queryDelete := `DELETE FROM users WHERE id = $1`
	if _, err := config.DB.ExecContext(ctx, queryDelete, mentorUserID); err != nil {
		log.Println("error deleting mentor user:", err)
		return err
	}
	return nil
}

// get all non approved startups
func GetAllNonApprovedStartups(ctx context.Context) ([]models.StartupDetail, error) {
	query :=
		`
	SELECT s.startup_id,
		       s.user_id,
		       s.startup_name,
		       s.website,
		       s.phone_number,
		       COALESCE(s.about, '')
		FROM startups s
		JOIN users u ON s.user_id = u.id
		WHERE u.is_admin = false AND approval_status = $1
	`

	rows, err := config.DB.QueryContext(ctx, query, false)

	if err != nil {
		log.Println("error fetching startups:", err)
		return nil, err
	}

	defer rows.Close()

	var startups []models.StartupDetail
	for rows.Next() {
		var startupID string
		var s models.StartupRegistration

		err := rows.Scan(
			&startupID,
			&s.UserID,
			&s.StartupName,
			&s.Website,
			&s.Phone,
		)
		if err != nil {
			log.Println("error scanning startup row:", err)
			continue
		}

		sDetail := models.StartupDetail{StartupRegistration: s}

		// fetch mentorships for each startup
		sDetail.Mentorships, _ = GetMentorshipsForStartup(ctx, startupID)

		startups = append(startups, sDetail)
	}

	if err := rows.Err(); err != nil {
		log.Println("iteration error in startups:", err)
	}

	return startups, nil

}
