package db

import (
	"context"
	"database/sql"
	"log"

	"github.com/E-Cell-IITH/startup_studio/config"
	"github.com/E-Cell-IITH/startup_studio/internal/helpers"
	"github.com/E-Cell-IITH/startup_studio/internal/models"
	"github.com/google/uuid"
)

// GetUserByEmail fetches an existing user by email.
func GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	query := `SELECT id, full_name, is_registered FROM users WHERE email = $1`

	var user models.User

	err := config.DB.QueryRowContext(ctx, query, email).Scan(&user.UserID, &user.UserName, &user.IsRegistered)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, sql.ErrNoRows
		}
		log.Printf("DB error in GetUserByEmail: %v", err)
		return nil, err
	}

	user.UserEmail = email

	return &user, nil
}

// InsertUser inserts a new user if they do not exist.
func InsertUser(ctx context.Context, fullName, email string) (*models.User, error) {
	uuidStr, err := helpers.GenerateUUIDFromEmail(email)
	if err != nil {
		log.Printf("Failed to generate UUID: %v", err)
		return nil, err
	}

	query := `INSERT INTO users (id, full_name, email, is_registered)
			  VALUES ($1, $2, $3, $4)
			  RETURNING id, full_name, is_registered`

	var user models.User

	err = config.DB.QueryRowContext(ctx, query, uuidStr, fullName, email, false).
		Scan(&user.UserID, &user.UserName, &user.IsRegistered)
	if err != nil {
		log.Printf("Failed to insert user: %v", err)
		return nil, err
	}

	user.UserEmail = email

	return &user, nil
}

func InsertStartup(ctx context.Context, startup models.StartupRegistration) (string, error) {
	uuidStr, err := helpers.GenerateUUIDFromEmail(startup.UserID)
	if err != nil {
		log.Printf("Failed to generate uuid: %v", err)
		return "", err
	}

	query := `
		INSERT INTO startups
		(startup_id, user_id, startup_name, website, phone_number,approval_status,problem_statement,solution,market_understanding,customer_understanding,competitive_understanding,usp,tech_understanding,vision, about)
		VALUES
		($1, $2, $3, $4, $5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
	`

	_, err = config.DB.ExecContext(ctx, query,
		uuidStr,
		startup.UserID,
		startup.StartupName,
		startup.Website,
		startup.Phone,
		false,
		startup.ProblemStatement,
		startup.Solution,
		startup.MarketUnderstanding,
		startup.CustomerUnderstanding,
		startup.CompetitiveUnderstanding,
		startup.USP,
		startup.TechUnderstanding,
		startup.Vision,
		startup.About,
	)

	if err != nil {
		log.Printf("Error inserting startup: %v", err)
		return "", err
	}

	return uuidStr, nil
}

func MarkUserAsRegistered(ctx context.Context, userID string) error {
	query := `
		UPDATE users
		SET is_registered = TRUE
		WHERE id = $1;
	`

	_, err := config.DB.ExecContext(ctx, query, userID)
	if err != nil {
		log.Printf("Error updating user registration: %v", err)
		return err
	}

	return nil
}

// GetUserNameByID retrieves the full name of a user by ID
func GetUserNameByID(ctx context.Context, userID string) (string, error) {
	query := `SELECT full_name FROM users WHERE id = $1`
	var name string
	err := config.DB.QueryRowContext(ctx, query, userID).Scan(&name)
	if err != nil {
		log.Printf("DB error in GetUserNameByID: %v", err)
		return "", err
	}
	return name, nil
}

// InsertMentor inserts a mentor record into the mentors table
func InsertMentor(ctx context.Context, mentor models.Mentor) (string, error) {
	uuidStr, err := helpers.GenerateUUIDFromEmail(mentor.UserID)
	if err != nil {
		log.Printf("Failed to generate mentor UUID: %v", err)
		return "", err
	}

	query := `
		INSERT INTO mentors
		(mentor_id, user_id, linked_in_url, phone_number, about, approval_status, mentor_name)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`

	_, err = config.DB.ExecContext(ctx, query,
		uuidStr,
		mentor.UserID,
		mentor.LinkedInURL,
		mentor.Phone,
		mentor.About,
		false,
		mentor.MentorName,
	)
	if err != nil {
		log.Printf("Error inserting mentor: %v", err)
		return "", err
	}

	return uuidStr, nil
}

// InsertMentorExperience inserts a list of experiences for a given mentor
func InsertMentorExperience(ctx context.Context, mentorID string, experiences []string) {
	for _, exp := range experiences {
		expID, _ := uuid.NewUUID()
		_, err := config.DB.ExecContext(ctx, `
			INSERT INTO experience (experience_id, experience, mentor_id)
			VALUES ($1, $2, $3)
		`, expID, exp, mentorID)
		if err != nil {
			log.Printf("Error inserting experience: %v", err)
		}
	}
}

// InsertMentorExpertise inserts a list of expertise for a given mentor
func InsertMentorExpertise(ctx context.Context, mentorID string, expertises []string) {
	for _, exp := range expertises {
		_, err := config.DB.ExecContext(ctx, `
			INSERT INTO mentor_expertise (mentor_id, expertise)
			VALUES ($1, $2)
		`, mentorID, exp)
		if err != nil {
			log.Printf("Error inserting expertise: %v", err)
		}
	}
}

func GetUserDetailsByEmail(ctx context.Context, email string) (*models.User, error) {
	query := `
		SELECT id, full_name, email, is_registered, is_admin
		FROM users
		WHERE email = $1
	`

	var user models.User
	err := config.DB.QueryRowContext(ctx, query, email).
		Scan(&user.UserID, &user.UserName, &user.UserEmail, &user.IsRegistered, &user.IsAdmin)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func GetStartupByUserID(ctx context.Context, userID string) (*models.StartupResponse, string, error) {
	query := `
		SELECT startup_id, startup_name, website, phone_number,approval_status,COALESCE(about, '')
		FROM startups
		WHERE user_id = $1
	`

	var startup models.StartupResponse
	var startupID string
	err := config.DB.QueryRowContext(ctx, query, userID).
		Scan(&startupID, &startup.StartupName, &startup.Website, &startup.Phone, &startup.ApprovalStatus, &startup.About)
	if err != nil {
		return nil, "", err
	}
	startup.UserID = userID
	// log.Println(startup)
	return &startup, startupID, nil
}

func GetStartupMentorships(ctx context.Context, startupID string) ([]models.MentorshipInfo, error) {
	query := `
		SELECT m.mentorship_id, mt.full_name
		FROM mentorships m
		JOIN mentors me ON m.mentor_id = me.mentor_id
		JOIN users mt ON me.user_id = mt.id
		WHERE m.startup_id = $1
	`

	rows, err := config.DB.QueryContext(ctx, query, startupID)
	if err != nil {
		log.Println("error fetching startup mentorships:", err)
		return nil, err
	}
	defer rows.Close()

	var mentorships []models.MentorshipInfo
	for rows.Next() {
		var ms models.MentorshipInfo
		if err := rows.Scan(&ms.MentorshipID, &ms.MentorName); err != nil {
			log.Println("error scanning startup mentorship row:", err)
			continue
		}
		mentorships = append(mentorships, ms)
		// log.Println(mentorships)
	}
	if err := rows.Err(); err != nil {
		log.Println("rows iteration error (startup mentorships):", err)
	}
	return mentorships, nil
}

func GetMentorByUserID(ctx context.Context, userID string) (*models.Mentor, string, error) {
	query := `
		SELECT mentor_id, phone_number, linked_in_url, approval_status, COALESCE(about, '')
		FROM mentors
		WHERE user_id = $1
	`

	var mentor models.Mentor
	var mentorID string
	err := config.DB.QueryRowContext(ctx, query, userID).
		Scan(&mentorID, &mentor.Phone, &mentor.LinkedInURL, &mentor.ApprovalStatus, &mentor.About)
	if err != nil {
		return nil, "", err
	}
	mentor.UserID = userID
	return &mentor, mentorID, nil
}

func GetMentorExpertise(ctx context.Context, mentorID string) []string {
	query := `SELECT expertise FROM mentor_expertise WHERE mentor_id = $1`
	rows, err := config.DB.QueryContext(ctx, query, mentorID)
	if err != nil {
		log.Println("error fetching expertise:", err)
		return nil
	}
	defer rows.Close()

	var result []string
	for rows.Next() {
		var exp string
		if err := rows.Scan(&exp); err != nil {
			log.Println("error scanning expertise row:", err)
			continue
		}
		result = append(result, exp)
	}
	return result
}

func GetMentorExperience(ctx context.Context, mentorID string) []string {
	query := `SELECT experience FROM experience WHERE mentor_id = $1`
	rows, err := config.DB.QueryContext(ctx, query, mentorID)
	if err != nil {
		log.Println("error fetching experience:", err)
		return nil
	}
	defer rows.Close()

	var result []string
	for rows.Next() {
		var exp string
		if err := rows.Scan(&exp); err != nil {
			log.Println("error scanning experience row:", err)
			continue
		}
		result = append(result, exp)
	}
	return result
}

func GetMentorMentorships(ctx context.Context, mentorID string) []models.MentorshipInfo {
	query := `
		SELECT m.mentorship_id, s.startup_name
		FROM mentorships m
		JOIN startups s ON m.startup_id = s.startup_id
		WHERE m.mentor_id = $1
	`
	rows, err := config.DB.QueryContext(ctx, query, mentorID)
	if err != nil {
		log.Println("error fetching mentor mentorships:", err)
		return nil
	}
	defer rows.Close()

	var result []models.MentorshipInfo
	for rows.Next() {
		var ms models.MentorshipInfo
		if err := rows.Scan(&ms.MentorshipID, &ms.StartupName); err != nil {
			log.Println("error scanning mentor mentorship row:", err)
			continue
		}
		result = append(result, ms)
	}

	// log.Println(result)

	return result
}
