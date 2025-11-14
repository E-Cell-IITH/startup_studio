# Startup Studio

Startup Studio is a platform designed by E-Cell IITH to connect aspiring startups with experienced mentors. It provides a streamlined process for registration, approval, and connection, facilitating the growth of our entrepreneurship ecosystem.

---

## Local Development Setup

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Backend (Go)

The backend is built using Go with the Gin framework.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/E-Cell-IITH/startup_studio
    cd startup_studio
    ```

2.  **Install dependencies:**
    ```bash
    go mod tidy
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `/backend` directory. You can copy the example file:
    ```bash
    cp .env.example .env
    ```

4.  **Run the server:**
    ```bash
    go run main.go
    ```
    The server will start, typically on port 8000 or the port specified in your `.env` file.

### Frontend (React + Vite)

The frontend is a React application built with Vite.

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```

2.  **Install dependencies:**
    (Use pnpm, npm, or yarn)
    ```bash
    npm install
    ```
    or
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `/frontend` directory. You can copy the example file:
    ```bash
    cp .env.example .env
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The frontend application will be available at `http://localhost:5173` (or another port if 5173 is in use).

---

## API Endpoints

All API endpoints are documented below, as defined in `backend/internal/router/routes.go`.

### Public Route

* `GET /test`: A simple test route to check if the server is running.

### Auth Routes (`/api/auth`)

* `POST /login`: Handles user login.
* `GET /logout`: Handles user logout.

**Protected Auth Routes** (Requires authentication middleware)

* `GET /getId/:userId`: Gets a user or mentor ID.
* `POST /mentor-registration`: Handles registration for new mentors.
* `POST /startup-registration`: Handles registration for new startups.
* `GET /me`: Fetches details of the currently authenticated user.

### Mentor Routes (`/api/mentors`)

**Protected Mentor Routes** (Requires authentication middleware)

* `GET /`: Fetches a list of all mentors.

### Startup Routes (`/api/startups`)

**Protected Startup Routes** (Requires authentication middleware)

* `GET /`: Fetches a list of all startups.

### Admin Routes (`/api/admin`)

**Protected Admin Routes** (Requires authentication middleware)

* `GET /mentors/approval/:userId`: Fetches all mentors who are pending approval.
* `PATCH /mentor/approve/:adminUserId/:mentorUserId`: Approves a specific mentor.
* `DELETE /mentor/reject/:adminUserId/:mentorUserId`: Rejects a specific mentor's application.
* `GET /startups/approval/:userId`: Fetches all startups that are pending approval.
* `PATCH /startup/approve/:adminUserId/:startupUserId`: Approves a specific startup.
* `DELETE /startup/reject/:adminUserId/:startupUserId`: Rejects a specific startup's application.
* `PUT /connect/:adminUserId/:startupUserId/:mentorUserId`: Connects a mentor with a startup.

---

## Contributing

Contributions are always welcome! We appreciate any help to improve this project.

If you'd like to contribute, please follow these steps:

1.  **Fork** the repository.
2.  Create a new **branch** for your feature or bug fix (e.g., `git checkout -b feature/AmazingFeature`).
3.  Make your changes and **commit** them (e.g., `git commit -m 'Add some AmazingFeature'`).
4.  **Push** your changes to your branch (e.g., `git push origin feature/AmazingFeature`).
5.  Open a **Pull Request** against the `main` branch of this repository.

We'll review your PR as soon as possible. Thank you for your support!