package db

import (
	"context"
	"log"
	"time"

	"github.com/E-Cell-IITH/startup_studio/config"
	"github.com/E-Cell-IITH/startup_studio/internal/models"
)

// GetAllStartups fetches all startups (excluding admins)
func GetAllStartups(ctx context.Context) ([]models.StartupDetail, error) {
	query := `
		SELECT s.startup_id,
		       s.user_id,
		       s.startup_name,
		       s.website,
		       s.phone_number,
		       COALESCE(s.about, '')
		FROM startups s
		JOIN users u ON s.user_id = u.id
		WHERE u.is_admin = false
	`

	rows, err := config.DB.QueryContext(ctx, query)
	if err != nil {
		log.Println("error fetching startups:", err)
		return nil, err
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
			&s.About,
		)
		if err != nil {
			log.Println("error scanning startup row:", err)
			continue
		}

		sDetail := models.StartupDetail{Startup: s}

		// fetch mentorships for each startup
		sDetail.Mentorships, _ = GetMentorshipsForStartup(ctx, startupID)

		startups = append(startups, sDetail)
	}

	if err := rows.Err(); err != nil {
		log.Println("iteration error in startups:", err)
	}

	return startups, nil
}

// GetMentorshipsForStartup fetches mentors linked to a startup
func GetMentorshipsForStartup(ctx context.Context, startupID string) ([]models.MentorshipInfo, error) {
	// short-lived context for query
	localCtx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	query := `
		SELECT m.mentorship_id, u.full_name
		FROM mentorships m
		JOIN mentors me ON m.mentor_id = me.mentor_id
		JOIN users u ON me.user_id = u.id
		WHERE m.startup_id = $1
	`

	rows, err := config.DB.QueryContext(localCtx, query, startupID)
	if err != nil {
		log.Println("error fetching mentorships for startup:", err)
		return nil, err
	}
	defer rows.Close()

	var mentorships []models.MentorshipInfo
	for rows.Next() {
		var ms models.MentorshipInfo
		if err := rows.Scan(&ms.MentorshipID, &ms.MentorName); err != nil {
			log.Println("error scanning mentorship row:", err)
			continue
		}
		mentorships = append(mentorships, ms)
	}

	if err := rows.Err(); err != nil {
		log.Println("iteration error in mentorship rows:", err)
	}

	return mentorships, nil
}
