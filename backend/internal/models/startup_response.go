package models

type StartupResponse struct {
    UserID                  string `json:"user_id"`
    StartupName             string `json:"startup_name"`
    Website                 string `json:"website"`
    Phone                   string `json:"phone"`
    About                   string `json:"about"`
    ProblemStatement        string `json:"problem_statement"`
    Solution                string `json:"solution"`
    MarketUnderstanding     string `json:"market_understanding"`
    CustomerUnderstanding   string `json:"customer_understanding"`
    CompetitiveUnderstanding string `json:"competitive_understanding"`
    USP                     string `json:"usp"`
    TechUnderstanding       string `json:"tech_understanding"`
    Vision                  string `json:"vision"`
    ApprovalStatus          bool   `json:"approval_status"`
}
