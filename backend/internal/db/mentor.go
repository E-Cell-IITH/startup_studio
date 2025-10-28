package db

import (
	"context"
	"log"
	"time"

	"github.com/E-Cell-IITH/startup_studio/config"
	"github.com/E-Cell-IITH/startup_studio/internal/models"
)

func GetAllMentors(ctx context.Context) ([]models.MentorDetail, error) {
	query := `
		SELECT mentor_id,
		       user_id,
		       mentor_name,
		       phone_number,
		       linked_in_url,
		       approval_status,
		       COALESCE(about, '')
		FROM mentors
		WHERE approval_status = $1;
	`

	rows, err := config.DB.QueryContext(ctx, query, true)
	if err != nil {
		log.Println("error fetching mentors:", err)
		return nil, err
	}
	defer rows.Close()

	var mentors []models.MentorDetail

	for rows.Next() {
		var mentorID string
		var m models.Mentor

		err := rows.Scan(
			&mentorID,
			&m.UserID,
			&m.MentorName,
			&m.Phone,
			&m.LinkedInURL,
			&m.ApprovalStatus,
			&m.About,
		)
		if err != nil {
			log.Println("error scanning mentor row:", err)
			continue
		}

		mDetail := models.MentorDetail{Mentor: m}

		// expertise
		mDetail.Expertise, _ = GetAllMentorExpertise(ctx, mentorID)

		// experience
		mDetail.Experience, _ = GetAllMentorExperience(ctx, mentorID)

		// mentorships
		mDetail.Mentorships, _ = GetAllMentorMentorships(ctx, mentorID)

		mentors = append(mentors, mDetail)
	}

	if err := rows.Err(); err != nil {
		log.Println("iteration error in mentors:", err)
	}

	return mentors, nil
}

func GetAllMentorExpertise(ctx context.Context, mentorID string) ([]string, error) {
	localCtx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	query := `SELECT expertise FROM mentor_expertise WHERE mentor_id = $1`
	rows, err := config.DB.QueryContext(localCtx, query, mentorID)
	if err != nil {
		log.Println("error fetching mentor expertise:", err)
		return nil, err
	}
	defer rows.Close()

	var expertise []string
	for rows.Next() {
		var exp string
		if err := rows.Scan(&exp); err == nil {
			expertise = append(expertise, exp)
		}
	}
	return expertise, nil
}

func GetAllMentorExperience(ctx context.Context, mentorID string) ([]string, error) {
	localCtx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	query := `SELECT experience FROM experience WHERE mentor_id = $1`
	rows, err := config.DB.QueryContext(localCtx, query, mentorID)
	if err != nil {
		log.Println("error fetching mentor experience:", err)
		return nil, err
	}
	defer rows.Close()

	var experience []string
	for rows.Next() {
		var exp string
		if err := rows.Scan(&exp); err == nil {
			experience = append(experience, exp)
		}
	}
	return experience, nil
}


func GetAllMentorMentorships(ctx context.Context, mentorID string) ([]models.MentorshipInfo, error) {
	localCtx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	query := `
		SELECT m.mentorship_id, s.startup_name
		FROM mentorships m
		JOIN startups s ON m.startup_id = s.startup_id
		WHERE m.mentor_id = $1
	`

	rows, err := config.DB.QueryContext(localCtx, query, mentorID)
	if err != nil {
		log.Println("error fetching mentor mentorships:", err)
		return nil, err
	}
	defer rows.Close()

	var mentorships []models.MentorshipInfo
	for rows.Next() {
		var ms models.MentorshipInfo
		if err := rows.Scan(&ms.MentorshipID, &ms.StartupName); err == nil {
			mentorships = append(mentorships, ms)
		}
	}

	// log.Println(mentorships)

	return mentorships, nil
}
