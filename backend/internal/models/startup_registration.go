package models

type StartupRegistration struct {
	StartupName              string `json:"startup_name" binding:"required"`
	Website                  string `json:"website"`
	Phone                    string `json:"phone"`
	UserID                   string `json:"user_id" binding:"required"`
	ApprovalStatus           bool   `json:"approval_status"`
	ProblemStatement         string `json:"problem_statement"`
	Solution                 string `json:"solution"`
	MarketUnderstanding      string `json:"market_understanding"`
	CustomerUnderstanding    string `json:"customer_understanding"`
	CompetitiveUnderstanding string `json:"competitive_understanding"`
	USP                      string `json:"usp"`
	TechUnderstanding        string `json:"tech_understanding"`
	Vision                   string `json:"vision"`
	About                    string `json:"about"`
}
