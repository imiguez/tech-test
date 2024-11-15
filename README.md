# Tech Test
  

## Overview

This project consists of a backend built with Nest.js, using Firebase Authentication, PostgreSQL, TypeOrm and Docker.


## Getting Started  

### Installation

Clone the repository:
```
git clone https://github.com/imiguez/tech-test.git 
cd tech-test
```
Running production docker-compose:
```
docker compose -f docker-compose.yml up
```

### Run requests in postman:
Login to get a HttpOnly Session Cookie which expires in 15 minutes.
```
method: POST
endpoint: localhost:3000/auth/login
body: {
	email: "test@gmail.com",
	password: "123456"
}
```
By default this user has 'Course 1' completed and 'Course 2' in progress. Database information could be accessible through an adminer instance. Credentials are in .env file.
```
url: localhost:8080
```
To get a list of available courses:
```
method: GET
endpoint: localhost:3000/user-courses/available
```
It should return a list of courses that either have 'Course 1' or 'Course 2' as their required course. Courses with no required course should also be included. Look at the following example of a response:
```
[
	{
		"id":  "3620363c-d6c9-49b0-9b51-37df6015dc62",
		"name":  "Course 1.2",
		"hierarchy":  0
	},
	{
		"id":  "961d6e05-9de9-47b1-a0f5-af7f3c292669",
		"name":  "Course 2.2",
		"hierarchy":  1
	}
]
```
Is it also possible to send a list of desired courses in the following format (courses is an array of ids):
```
method: POST
endpoint: localhost:3000/user-courses/study-plan
body: {
	"userId":  "771f7bc5-08f9-43da-ba67-71ec17804783",
	"courses":  [
		"685ffcd3-6492-4d7d-9c57-c6d6c34a4ec3", // Course 1
		"fba77af1-ee3e-400a-9c4e-c54e43ef0832", // Course 2
		"bed07072-2842-4e77-86e6-aaf8c4ea4f2c", // Course 1.2
		"108a6efc-51e0-49fc-ae72-931eb9bc94ff", // Course 2.2
		"961d6e05-9de9-47b1-a0f5-af7f3c292669", // Course 3
		"3620363c-d6c9-49b0-9b51-37df6015dc62" // Course 4
	]
}
```

This should return the same list, but with the following filters applied:
-   Completed courses
-   The course in progress (if applicable)
-   Courses that are selectable for the user, which means the `requiredCourse` must be completed or NULL.
```
[
	{
		"id":  "685ffcd3-6492-4d7d-9c57-c6d6c34a4ec3",
		"name":  "Course 1", // Completed course
		"hierarchy":  0
	},
	{
		"id":  "3620363c-d6c9-49b0-9b51-37df6015dc62",
		"name":  "Course 1.2", // Required course is null
		"hierarchy":  0
	},
	{
		"id":  "fba77af1-ee3e-400a-9c4e-c54e43ef0832",
		"name":  "Course 2", // Course in progress
		"hierarchy":  1
	},
	{
		"id":  "961d6e05-9de9-47b1-a0f5-af7f3c292669",
		"name":  "Course 2.2", // Required course has been completed
		"hierarchy":  1
	}
]
```