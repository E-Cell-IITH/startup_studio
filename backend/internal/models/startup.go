package models

type Startup struct {
    StartupName string `json:"startup_name" binding:"required"`
    Industry    string `json:"industry"`
    Website     string `json:"website"`
    Phone       string `json:"phone"`
    UserID      string `json:"user_id" binding:"required"`
    ProfilePic  string `json:"profile_photo_ref"`
}