### JWT Authentication, Passport.

In this lesson we’ll learn how to implement authorization functionality creating NodeJS API. It will be based on our previously created API (notes CRUD).

What could be helpful? As we’re working with databases (SQLite) it’s better to have a database management tool, like [DBeaver](https://dbeaver.io/download/). Also, there should be installed tools such as Postman or curl (cli tool) to have a more comfortable way to test our API endpoints. Once those are installed, we’re ready to go.

--- 

#### Here’s what we have to implement during that session:
 - Create the database table named "user" to store the login and password there
   
 - Create POST /signup endpoint and store login (email) and hashed password
   
 - Create POST /signin endpoint that will return access token on success or 404 with message “User not found” on fail

 - Create express middleware to validate the token provided in Authorization header and to add user’s data to the “request” object if access token is correct

To test the implementation you have to make POST, DELETE and PUT /notes endpoints to be authorized

Other endpoints should remain public

---

#### Here’s a list of npm packages that could be helpful during the implementation:
 1) Bcrypt - it will help you to create and compare password hash
 2) Jsonwebtoken - for JWT generation and validation
 3) Sequelize - promise-based ORM tool (you can use it with SQLite as well)

