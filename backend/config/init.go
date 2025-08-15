package config


// init function of config 
func Init(){
	LoadEnv()
	ConnectDatabase()
}