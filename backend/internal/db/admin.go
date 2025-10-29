package db

import (
	"context"
	"log"

	"github.com/E-Cell-IITH/startup_studio/config"
	"github.com/E-Cell-IITH/startup_studio/internal/helpers"
	"github.com/E-Cell-IITH/startup_studio/internal/models"
	"github.com/google/uuid"
	"github.com/lib/pq"
)

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

func RejectMentor(ctx context.Context, mentorUserID string) error {
	queryDelete := `DELETE FROM users WHERE id = $1`
	if _, err := config.DB.ExecContext(ctx, queryDelete, mentorUserID); err != nil {
		log.Println("error deleting mentor user:", err)
		return err
	}
	return nil
}

func GetAllNonApprovedStartups(ctx context.Context) ([]*models.StartupResponse, error) {
	query := `
		SELECT 
    s.user_id,
    s.startup_name,
    s.website,
    s.phone_number,
    COALESCE(s.about, '') AS about,
    COALESCE(s.problem_statement, '') AS problem_statement,
    COALESCE(s.solution, '') AS solution,
    COALESCE(s.market_understanding, '') AS market_understanding,
    COALESCE(s.customer_understanding, '') AS customer_understanding,
    COALESCE(s.competitive_understanding, '') AS competitive_understanding,
    COALESCE(s.usp, '') AS usp,
    COALESCE(s.tech_understanding, '') AS tech_understanding,
    COALESCE(s.vision, '') AS vision
	FROM startups AS s
		INNER JOIN users AS u 
    		ON s.user_id = u.id
		WHERE 
    		u.is_admin = FALSE 
    	AND s.approval_status = $1
	ORDER BY 
    	s.created_at DESC;

	`

	rows, err := config.DB.QueryContext(ctx, query, false)
	if err != nil {
		log.Println("error fetching startups:", err)
		return nil, err
	}
	defer rows.Close()

	var startups []*models.StartupResponse

	for rows.Next() {
		s := new(models.StartupResponse)

		err := rows.Scan(
			&s.UserID,
			&s.StartupName,
			&s.Website,
			&s.Phone,
			&s.About,
			&s.ProblemStatement,
			&s.Solution,
			&s.MarketUnderstanding,
			&s.CustomerUnderstanding,
			&s.CompetitiveUnderstanding,
			&s.USP,
			&s.TechUnderstanding,
			&s.Vision,
		)
		if err != nil {
			log.Println("error scanning startup row:", err)
			continue
		}

		startups = append(startups, s)
	}

	if err := rows.Err(); err != nil {
		log.Println("iteration error in startups:", err)
	}

	return startups, nil
}

func ApproveStartup(ctx context.Context, startupUserid string) error {
	var startupID uuid.UUID
	querySelect := `SELECT startup_id FROM startups WHERE user_id = $1`

	if err := config.DB.QueryRowContext(ctx, querySelect, startupUserid).Scan(&startupID); err != nil {
		log.Println("error finding startup:", err)
		return err
	}

	queryUpdate := `UPDATE startups SET approval_status = TRUE WHERE startup_id = $1`
	if _, err := config.DB.ExecContext(ctx, queryUpdate, startupID); err != nil {
		log.Println("error updating startup approval:", err)
		return err
	}

	return nil
}

func RejectStartup(ctx context.Context, startupUserid string) error {
	queryDelete := `DELETE FROM users WHERE id = $1`
	if _, err := config.DB.ExecContext(ctx, queryDelete, startupUserid); err != nil {
		log.Println("error deleting startup user:", err)
		return err
	}
	return nil
}
func ConnectMentorWithStartup(ctx context.Context, startupUserID string, mentorUserID string) error {
	mentorshipID, err := helpers.GenerateUUID(mentorUserID)
	if err != nil {
		log.Println("error generating mentorship uuid:", err)
		return err
	}

	queryStartupID := `
		SELECT startup_id FROM startups WHERE user_id = $1
	`

	queryMentorID := `
		SELECT mentor_id FROM mentors WHERE user_id = $1
	`

	var startupID, mentorID string

	if err := config.DB.QueryRowContext(ctx, queryStartupID, startupUserID).Scan(&startupID); err != nil {
		log.Println("error fetching startup_id:", err)
		return err
	}

	if err := config.DB.QueryRowContext(ctx, queryMentorID, mentorUserID).Scan(&mentorID); err != nil {
		log.Println("error fetching mentor_id:", err)
		return err
	}

	queryConnect := `
		INSERT INTO mentorships (mentorship_id, mentor_id, startup_id)
		VALUES ($1, $2, $3)
	`

	if _, err := config.DB.ExecContext(ctx, queryConnect, mentorshipID, mentorID, startupID); err != nil {
		log.Println("error inserting mentorship record:", err)
		return err
	}

	return nil
}

