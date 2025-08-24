package helpers

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/gin-gonic/gin"
)

func GetPresignedURL(c *gin.Context) {
	AWS_REGION := os.Getenv("AWS_REGION")
	AWS_BUCKET_NAME := os.Getenv("AWS_BUCKET_NAME")
	filename := c.Query("filename")
	userID := c.Query("user_id")
	AKID := os.Getenv("AWS_KEY_ID")
	SECRET_KEY := os.Getenv("AWS_SECRET_KEY")

	// create new session

	sess, err := session.NewSession(&aws.Config{
		Region:           aws.String(AWS_REGION),
		Credentials:      credentials.NewStaticCredentials(AKID, SECRET_KEY, ""),
		S3ForcePathStyle: aws.Bool(true),   
	})
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to init session"})
		return
	}

	svc := s3.New(sess)

	// define key

	key := "profiles/" + userID + "/" + filename

	req, _ := svc.PutObjectRequest(&s3.PutObjectInput{
		Bucket: aws.String(AWS_BUCKET_NAME),
		Key:    aws.String(key),
		// ACL:    aws.String("public-read"),-> my bucket private -> My ACL public-read -> created problem 
	})

	// generate presign and file url

	urlStr, err := req.Presign(15 * time.Minute)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to sign url"})
		return
	}

	fileURL := fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", AWS_BUCKET_NAME, AWS_REGION, key)

	// send response

	c.JSON(http.StatusOK, gin.H{
		"upload_url": urlStr,
		"file_url":   fileURL,
	})
}
