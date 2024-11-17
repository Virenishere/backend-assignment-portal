# Backend Assignment Portal

This repository contains the backend API for an assignment portal. It allows users to upload assignments and admins to manage those assignments. The application uses JWT for authentication, bcrypt for password hashing, Zod for validation, and MongoDB for data storage.

This task is part of an **internship project** for **GrowthX**.

## Technologies Used

- **Node.js** - Backend framework
- **Express.js** - Web framework for Node.js
- **MongoDB** (Cloud) - Database for storing users, admins, and assignments
- **JWT** - Authentication for secure login
- **Zod** - Data validation for registration
- **bcrypt** - Password hashing
- **cookie-parser** - For cookie-based authentication
- **dotenv** - For managing environment variables
- **nodemon** - For automatic server restart during development

## Prerequisites

Make sure you have `Node.js` and `npm` installed on your local machine.

You can download Node.js from the official site: https://nodejs.org/

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Virenishere/backend-assignment-portal.git
    cd backend-assignment-portal
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file and set the necessary environment variables such as `DB_URI` for MongoDB connection, `JWT_SECRET`, etc.

### `.env.example` File

```dotenv
# Port where the server will run
PORT=3000

# MongoDB URI for connecting to your database (replace this with your actual MongoDB connection string)
MONGO_URI=your_mongodb_connection_string_here

# JWT password for user authentication (set this to a secure password)
JWT_USER_PASSWORD=your_jwt_user_password_here

# JWT password for admin authentication (set this to a secure password)
JWT_ADMIN_PASSWORD=your_jwt_admin_password_here
```

## Running the Application

- For **development** use the following command to run the server with auto-reloading:
    ```bash
    npm run dev
    ```

![image](https://github.com/user-attachments/assets/245ed9d6-b14a-4deb-8369-eb52ea89731b)



- For **production** use the following command to start the server:
    ```bash
    npm run start
    ```

![image](https://github.com/user-attachments/assets/bb376f8b-f47f-45ea-982a-4073f4a78f2d)


## Routes

### Admin Routes
- **POST /register** - Register a new admin

![image](https://github.com/user-attachments/assets/d3334537-f39a-4c3b-967e-f5ffcdf59d0f)

- **POST /login** - Login for admin

![image](https://github.com/user-attachments/assets/8619c7fd-4e83-4377-af83-098de07e3a81)


- **GET /assignments** - Get all assignments (admin only)

![image](https://github.com/user-attachments/assets/14d79f4f-e803-4a45-936a-4f5e03149716)

- **POST /assignments/:id/accept** - Admin accepts the assignment

![image](https://github.com/user-attachments/assets/e4242845-79c5-418b-975b-b9ad60339a12)

- **POST /assignments/:id/reject** - Admin rejects the assignment

![image](https://github.com/user-attachments/assets/bb083a97-7050-43d2-8907-6519c5a2508b)

### User Routes
- **POST /register** - Register a new user

![image](https://github.com/user-attachments/assets/811bfaff-d1e8-4628-8c83-6b71bfe07c54)

- **POST /login** - Login for user

![image](https://github.com/user-attachments/assets/d1a9f138-1ae8-4f1e-82c0-8b2ffe619fec)

- **POST /upload** - Upload an assignment (user only)

![image](https://github.com/user-attachments/assets/44d66e9f-a822-471e-b7e1-2d8bc04c238b)

- **GET /admins** - Get all admins (user only)

![image](https://github.com/user-attachments/assets/6b40b8e7-8c84-4d39-a39a-b74689e6083c)

## Postman Configuration

When testing with Postman, make sure to set the following headers:

- **For Admin**:  
    `admin-token: token`  
    Set the value of the `token` to the JWT token generated after logging in as an admin.

- **For User**:  
    `user-token: token`  
    Set the value of the `token` to the JWT token generated after logging in as a user.

![image](https://github.com/user-attachments/assets/08d70d22-934e-4dd6-9243-073dc351fcb4)

- **Content-Type**:  
    `Content-Type: application/json`

![image](https://github.com/user-attachments/assets/c345e5ed-cbf5-4026-87ae-4c7728b8ad48)

## Dummy Test Data

You can use the following dummy test data for user and admin registration in Postman:

### User
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "Password@123"
}
```

### Admin
```json
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

These users are already stored in the MongoDB database, so you can use them directly to test the functionality.

## Upload Test Data (Postman Example)

For uploading an assignment, use the following JSON data:

```json
{
  "userId": "John Doe",  // FirstName LastName format
  "task": "Hello World",
  "admin": "Admin User"  // FirstName LastName format
}
```

This data will be saved in the MongoDB database.

## JWT and Token Expiry

- JWT tokens are used for authentication. The token will expire after **1 hour**.
- Once the token expires, you will need to **re-login** with the same credentials to generate a new token.

## Error Handling

- If the **admin** tries to modify the status of a task assigned to another admin, they will not be allowed to do so.
- Only the admin who **accepts** the task will be able to change its status to **rejected** or **accepted**.
  
## Using MongoDB

All data is stored in MongoDB Cloud. The necessary credentials are already configured, but you can replace them with your own MongoDB connection URI in the `.env` file if needed.

## Frontend Integration (Optional)

If you're planning to integrate this API with a frontend application, make sure that the **JWT token** is stored in the **cookie** for automatic login, or manually add it to the request header in Postman for testing.





