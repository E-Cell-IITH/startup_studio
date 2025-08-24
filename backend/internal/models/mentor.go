package models

type Mentor struct {
	Name       string   `json:"mentor_name"`
	Industry   string   `json:"industry"`
	Phone      string   `json:"phone_number"`
	ProfilePic string   `json:"profile_photo_ref"`
	Experience []string `json:"experience"`
	Expertise  []string `json:"expertise"`
}
