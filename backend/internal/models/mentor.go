package models

type Mentor struct {
	Name       string   `json:"mentor_name"`
	Phone      string   `json:"phone_number"`
	ProfilePic string   `json:"profile_photo_ref"`
	Experience []string `json:"experience"`
	Expertise  []string `json:"expertise"`
	About      string   `json:"about"`
}
