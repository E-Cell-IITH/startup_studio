package models

type Mentor struct {
	Phone          string   `json:"phone"`
	UserID         string   `json:"user_id" binding:"required"`
	ProfilePic     string   `json:"profile_photo_ref"`
	LinkedInURL    string   `json:"linked_in_url"`
	Experience     []string `json:"experience"`
	Expertise      []string `json:"expertise"`
	About          string   `json:"about"`
	ApprovalStatus bool     `json:"approval_status"`
}
