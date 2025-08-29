package models

type UserResponse struct {
	User          User           `json:"user"`
	StartupDetail *StartupDetail `json:"startup_detail,omitempty"`
	MentorDetail  *MentorDetail  `json:"mentor_detail,omitempty"`
}

type StartupDetail struct {
	Startup
	Mentorships []MentorshipInfo `json:"mentorships"`
}

type MentorDetail struct {
	Mentor
	Mentorships []MentorshipInfo `json:"mentorships"`
}

type MentorshipInfo struct {
	MentorshipID string `json:"mentorship_id"`
	StartupName  string `json:"startup_name,omitempty"`
	MentorName   string `json:"mentor_name,omitempty"`
	
}
