package db

import (
	"context"

	"github.com/E-Cell-IITH/startup_studio/config"
	"github.com/E-Cell-IITH/startup_studio/internal/models"
	"github.com/google/uuid"
	"github.com/lib/pq"
)

func GetDetailsByID(c context.Context, userId string) (bool, string, error) {
	var isAdmin bool
	var dbEmail string
	var err error

	queryUser := `
		SELECT is_admin, email FROM users WHERE id = $1;
	`

	err = config.DB.QueryRowContext(c, queryUser, userId).Scan(&isAdmin, &dbEmail)

	return isAdmin, dbEmail, err
}

func GetAllNonApprovedMentors(c context.Context) ([]models.Mentor, error) {

	var mentors []models.Mentor
	var err error

	queryMentors := `
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

	rows, err := config.DB.QueryContext(c, queryMentors)
	if err != nil {
		return mentors, err //returns an empty array when there's an error
	}

	defer rows.Close()

	for rows.Next() {
		var mentor models.Mentor
		var experiences, expertises []string

		err = rows.Scan(
			&mentor.UserID,
			&mentor.Phone,
			&mentor.LinkedInURL,
			&mentor.About,
			&mentor.ApprovalStatus,
			&mentor.MentorName,
			pq.Array(&experiences),
			pq.Array(&expertises),
		)
		if err != nil {
			mentors = []models.Mentor{}
			return mentors, err //Again making sure that there's an empty array when an error.
		}

		mentor.Experience = experiences
		mentor.Expertise = expertises

		mentors = append(mentors, mentor)

	}

	return mentors, err
}

func ApproveMentor(c context.Context, mentorUserID string) error {

	queryMentor := `SELECT mentor_id FROM mentors WHERE user_id = $1`

	var mentorId uuid.UUID
	var err error

	err = config.DB.QueryRowContext(c, queryMentor, mentorUserID).Scan(&mentorId)
	if err != nil {
		return err
	}

	//update mentor approval
	queryUpdate := `UPDATE mentors SET approval_status = $1 WHERE mentor_id = $2`

	_, err = config.DB.ExecContext(c, queryUpdate, true, mentorId)
	if err != nil {
		return err
	}

	return err

}

func RejectMentor(c context.Context, mentorUserID string) error {
	queryDelete := `DELETE FROM users WHERE id = $1`

	var err error

	//Delete the user.
	_, err = config.DB.ExecContext(c, queryDelete, mentorUserID)

	return err

}
