package controllers

import (
	"database/sql"
	"errors"
	"github.com/E-Cell-IITH/startup_studio/config"
	"github.com/E-Cell-IITH/startup_studio/internal/helpers"
	"github.com/E-Cell-IITH/startup_studio/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"google.golang.org/api/idtoken"
	"log"
	"net/http"
	"os"
)

type LoginContent struct {
	ID string `json:"idToken"`
}

var clientID string = os.Getenv("GOOGLE_CLIENT_ID")

func Login(c *gin.Context) {
	// get id token and email
	var loginRequest LoginContent
	if err := c.ShouldBindBodyWithJSON(&loginRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request payload"})
		return
	}

	idTokenFrontend := loginRequest.ID
	ctx := c.Request.Context()

	// verify id token
	payload, err := idtoken.Validate(ctx, idTokenFrontend, clientID)
	if err != nil {
		log.Printf("Token validation failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		return
	}

	emailStr, ok := payload.Claims["email"].(string)
	if !ok {
		log.Printf("Email claim missing in token payload")
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		return
	}

	fullName, _ := payload.Claims["name"].(string)

	// check if the user exists
	var id string
	var name string
	var is_registered bool
	query := `SELECT id, full_name, is_registered FROM users WHERE email = $1`
	err = config.DB.QueryRowContext(ctx, query, emailStr).Scan(&id, &name, &is_registered)

	if err != nil {
		if err == sql.ErrNoRows {
			// insert user if not found
			uuidStr, err := helpers.GenerateUUIDFromEmail(emailStr)
			if err != nil {
				log.Printf("Failed to generate uuid: %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
				return
			}

			insertQuery := `INSERT INTO users (id, full_name, email,is_registered) VALUES ($1, $2, $3,$4) RETURNING id, full_name`
			err = config.DB.QueryRowContext(ctx, insertQuery, uuidStr, fullName, emailStr, false).Scan(&id, &name)
			if err != nil {
				log.Printf("Failed to insert user: %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
				return
			}
		} else {
			log.Printf("Error checking user: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
			return
		}
	}

	// generate jwt token

	token, err := helpers.GenerateToken(emailStr)

	if err != nil {
		log.Printf("Failed to generate token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		return
	}

	// log.Println(token)

	c.SetCookie(
		"token",
		token,
		48*60*60,
		"/",         // path
		"localhost", // domain → leave empty for localhost
		false,       // secure → must be true in production (HTTPS)
		false,       // httpOnly → true in production
	)

	// return successful login response

	c.JSON(http.StatusOK, gin.H{
		"message":       "Login Successfull",
		"user_id":       id,
		"is_registered": is_registered,
	})

}

func StartupRegistration(c *gin.Context) {

	// get the startup from frontend
	var startup models.Startup

	err := c.ShouldBindBodyWithJSON(&startup)

	// validate the startup content
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request payload"})
		return
	}

	// get the user id
	userId := startup.UserID

	if userId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "User ID is required"})
		return
	}

	// generate a new uuid for startups
	uuidStr, err := helpers.GenerateUUIDFromEmail(userId)
	if err != nil {
		log.Printf("Failed to generate uuid: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		return
	}

	// insert everything to that startups
	query := `
    INSERT INTO startups
	(startup_id, user_id, startup_name, website, profile_photo_ref,about,phone_number) 
	VALUES 
	($1,$2,$3,$4,$5,$6,$7)
	`

	ctx := c.Request.Context()

	_, err = config.DB.ExecContext(ctx, query,
		uuidStr,
		userId,
		startup.StartupName,
		startup.Website,
		startup.ProfilePic,
		startup.About,
		startup.Phone,
	)

	if err != nil {
		log.Printf("Error in registering startup: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		return
	}

	// update the user to is registered
	updateToRegistered := `
    UPDATE users
	SET is_registered = TRUE
	WHERE id = $1;
	`

	_, err = config.DB.ExecContext(ctx, updateToRegistered, userId)

	if err != nil {
		log.Printf("Error in  updating user's registration status: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		return
	}

	// send response
	c.JSON(http.StatusOK, gin.H{
		"message":       "Login Successfull",
		"id":            userId,
		"startup_id":    uuidStr,
		"is_registered": true,
	})

}

func MentorRegistration(c *gin.Context) {

	// get the mentor from frontend
	var mentor models.Mentor

	err := c.ShouldBindJSON(&mentor)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request payload"})
		return
	}

	// get the user id
	userId := mentor.UserID
	if userId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "User ID is required"})
		return
	}

	// generate a new uuid for mentors
	uuidStr, err := helpers.GenerateUUIDFromEmail(userId)
	if err != nil {
		log.Printf("Failed to generate uuid: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		return
	}

	ctx := c.Request.Context()

	// insert into mentors table with approval_status = false
	query := `
		INSERT INTO mentors
		(mentor_id, user_id, linked_in_url, profile_photo_ref, phone_number, about, approval_status)
		VALUES 
		($1,$2,$3,$4,$5,$6,$7)
	`

	_, err = config.DB.ExecContext(ctx, query,
		uuidStr,
		userId,
		mentor.LinkedInURL,
		mentor.ProfilePic,
		mentor.Phone,
		mentor.About,
		false,
	)

	if err != nil {
		log.Printf("Error in registering mentor: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
		return
	}

	// insert experiences
	for _, exp := range mentor.Experience {
		expID, _ := uuid.NewUUID()
		_, err = config.DB.ExecContext(ctx, `
			INSERT INTO experience (experience_id, experience, mentor_id)
			VALUES ($1, $2, $3)
		`, expID, exp, uuidStr)
		if err != nil {
			log.Printf("Error inserting experience: %v", err)
		}
	}

	// insert expertise + link to mentor
	for _, exp := range mentor.Expertise {
		var expertiseID string

		// check if expertise already exists
		err := config.DB.QueryRowContext(ctx, `
			SELECT expertise_id FROM expertise WHERE expertise = $1
		`, exp).Scan(&expertiseID)

		if err == sql.ErrNoRows {
			// insert new expertise
			newExpID, _ := uuid.NewUUID()
			_, err = config.DB.ExecContext(ctx, `
				INSERT INTO expertise (expertise_id, expertise)
				VALUES ($1, $2)
			`, newExpID, exp)
			if err != nil {
				log.Printf("Error inserting new expertise: %v", err)
				continue
			}
			expertiseID = newExpID.String()
		} else if err != nil {
			log.Printf("Error checking expertise: %v", err)
			continue
		}

		// link mentor to expertise
		_, err = config.DB.ExecContext(ctx, `
			INSERT INTO mentor_expertise (mentor_id, expertise_id)
			VALUES ($1, $2)
		`, uuidStr, expertiseID)
		if err != nil {
			log.Printf("Error linking mentor expertise: %v", err)
		}
	}

	// send response
	c.JSON(http.StatusOK, gin.H{
		"message":   "Mentor registration submitted. Pending admin approval.",
		"user_id":   userId,
		"mentor_id": uuidStr,
	})
}

func Logout(c *gin.Context) {

	// set cookie life 0
	c.SetCookie(
		"token",
		"",
		-1,
		"/",         // path
		"localhost", // domain → leave empty for localhost
		false,       // secure → must be true in production (HTTPS)
		false,       // httpOnly → true in production
	)

	// return successful login response

	c.JSON(http.StatusOK, gin.H{
		"message": "Logout Successfull",
	})

}

func GetUserDetails(c *gin.Context) {
	var resp models.UserResponse
	ctx := c.Request.Context()

	// get email from middleware context
	email, exists := c.Get("email")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "email not found in token"})
		return
	}

	// log.Println("Got email from request", email)

	// fetch user info
	queryUser := `
        SELECT id, full_name, email, is_registered,is_admin
        FROM users
        WHERE email = $1
    `

	var currUser models.User
	err := config.DB.QueryRowContext(ctx, queryUser, email).
		Scan(&currUser.UserID, &currUser.UserName, &currUser.UserEmail, &currUser.IsRegistered, &currUser.IsAdmin)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		} else {
			log.Println("error fetching user:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not fetch user"})
		}
		return
	}
	resp.User = currUser

	log.Println("Found current user appended it to resp", resp)

	// ------------------------
	// check if the user is a startup
	// ------------------------

	// log.Println("Going to check for startup")

	queryStartup := `
    SELECT startup_id,
    startup_name,
	website,
    phone_number,
    profile_photo_ref,
    COALESCE(about, '')
    FROM startups
    WHERE user_id = $1
	`

	var startup models.Startup
	var startupID string
	err = config.DB.QueryRowContext(ctx, queryStartup, currUser.UserID).
		Scan(&startupID, &startup.StartupName, &startup.Website, &startup.Phone, &startup.ProfilePic, &startup.About)

	// log.Println("Ran the startup query, error:", err)
	// log.Println(startupID)
	// log.Println(startup)
	startup.UserID = currUser.UserID.String()

	if err == nil {
		sDetail := models.StartupDetail{Startup: startup}

		// log.Println("Going to look for startup mentorships")

		// fetch mentorships for startup
		mentorshipQuery := `
            SELECT m.mentorship_id, mt.full_name
            FROM mentorships m
            JOIN mentors me ON m.mentor_id = me.mentor_id
            JOIN users mt ON me.user_id = mt.id
            WHERE m.startup_id = $1
        `
		rows, err := config.DB.QueryContext(ctx, mentorshipQuery, startupID)

		// log.Println("Ran query for startup mentorships")

		if err != nil {
			log.Println("error fetching startup mentorships:", err)
		} else {
			defer rows.Close()
			for rows.Next() {
				var ms models.MentorshipInfo
				if err := rows.Scan(&ms.MentorshipID, &ms.MentorName); err != nil {
					log.Println("error scanning startup mentorship row:", err)
					continue
				}
				sDetail.Mentorships = append(sDetail.Mentorships, ms)

				// log.Println("got the mentorships")

			}
			if err := rows.Err(); err != nil {
				log.Println("rows iteration error (startup mentorships):", err)
			}
		}

		resp.StartupDetail = &sDetail

		// log.Println("Current user is a startup appended in startup", resp)

		c.JSON(http.StatusOK, resp)
		return
	}

	// ------------------------
	// check if the user is a mentor
	// ------------------------
	queryMentor := `
    SELECT mentor_id,
    phone_number,
	linked_in_url,
    profile_photo_ref,
	approval_status,
    COALESCE(about, '')
	FROM mentors
	WHERE user_id = $1;
    `
	var mentor models.Mentor
	var mentorID string
	err = config.DB.QueryRowContext(ctx, queryMentor, currUser.UserID).
		Scan(&mentorID, &mentor.Phone, &mentor.LinkedInURL, &mentor.ProfilePic, &mentor.ApprovalStatus, &mentor.About)
	if err == nil {
		mDetail := models.MentorDetail{Mentor: mentor}

		// expertise
		expertiseQuery := `
    SELECT e.expertise
    FROM mentor_expertise me
    JOIN expertise e ON me.expertise_id = e.expertise_id
    WHERE me.mentor_id = $1
`

		rowsExp, err := config.DB.QueryContext(ctx, expertiseQuery, mentorID)
		if err != nil {
			log.Println("error fetching expertise:", err)
		} else {
			defer rowsExp.Close()
			for rowsExp.Next() {
				var exp string
				if err := rowsExp.Scan(&exp); err != nil {
					log.Println("error scanning expertise row:", err)
					continue
				}
				mDetail.Expertise = append(mDetail.Expertise, exp)
			}
			if err := rowsExp.Err(); err != nil {
				log.Println("rows iteration error (expertise):", err)
			}
		}

		// experience
		expQuery := `
    SELECT experience
    FROM experience
    WHERE mentor_id = $1
`
		rowsExperience, err := config.DB.QueryContext(ctx, expQuery, mentorID)

		if err != nil {
			log.Println("error fetching experience:", err)
		} else {
			defer rowsExperience.Close()
			for rowsExperience.Next() {
				var exp string
				if err := rowsExperience.Scan(&exp); err != nil {
					log.Println("error scanning experience row:", err)
					continue
				}
				mDetail.Experience = append(mDetail.Experience, exp)
			}
			if err := rowsExperience.Err(); err != nil {
				log.Println("rows iteration error (experience):", err)
			}
		}

		// mentorships
		mentorshipQuery := `
            SELECT m.mentorship_id, s.startup_name
            FROM mentorships m
            JOIN startups s ON m.startup_id = s.startup_id
            WHERE m.mentor_id = $1
        `
		rowsMs, err := config.DB.QueryContext(ctx, mentorshipQuery, mentorID)
		if err != nil {
			log.Println("error fetching mentor mentorships:", err)
		} else {
			defer rowsMs.Close()
			for rowsMs.Next() {
				var mentorshipID string
				var startupName string
				if err := rowsMs.Scan(&mentorshipID, &startupName); err != nil {
					log.Println("error scanning mentor mentorship row:", err)
					continue
				}
				mDetail.Mentorships = append(mDetail.Mentorships, models.MentorshipInfo{
					MentorshipID: mentorshipID,
					StartupName:  startupName,
				})
			}

			if err := rowsMs.Err(); err != nil {
				log.Println("rows iteration error (mentor mentorships):", err)
			}
		}

		resp.MentorDetail = &mDetail

		log.Println("current user is a mentor appended into resp", resp)
		c.JSON(http.StatusOK, resp)
		return
	}

	log.Println(resp)

	// fallback: just return user info
	c.JSON(http.StatusOK, resp)
}
