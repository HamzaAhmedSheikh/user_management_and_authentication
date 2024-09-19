# User Management and Authentication System

## Overview
Handles all operations related to user registration, authentication, profile management, and access control to ensure secure and authorized access.

## Backend
- **Language**: Python
- **Framework**: FastAPI
- **Database**: PostgreSQL
- **Containerization**: Docker Compose

## Frontend
- **Framework**: Next.js
  
## Features
- User registration and login
- OAuth authorization
- Token management
- Profile creation and updating
- Password reset and email/phone verification
- Secure access control


## Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Steps to Run the Project

1. **Clone the Repository**
   - The repository link can be found in the group description(Group name: "Panaversity Working KHI"). Use the link to clone the repository and open terminal inside that folder:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Set Up Environment Variables**
   - **Frontend**:
       1. Navigate to the `front-end` folder.
       2. Create a `.env.local` file by:
          - Copying the contents of `.env.example`.
          - Ensuring that `.env.local` is placed inside the `front-end` folder, in the same location as `.env.example`.

   - **Backend**:
       1. Navigate to the `back-end/user-service` folder.
       2. Download the `.env` file from the Google Drive link provided in your group description (Group name: "Panaversity Working KHI") and place it in the `back-end/user-service` directory.
       3. Rename the file:
          - If the filename appears as `env`, rename it to `.env` after downloading, as it might download without the leading dot.


3. **Build and Run Docker Containers**
   From the root project directory, run:
   ```
   docker-compose up -d --build
   ```

4. **Frontend Installation**
   - Navigate to `front-end` folder
   - Open terminal and run: 
      ```
      npm install
      ```
      This command will install all the necessary packages.
   - After the installation is complete, run:
      ```
      npm run dev
      ```
      This will start the development server.


5. **Access the Application**
   - **Frontend**: Open your browser and navigate to `http://localhost:3000` 
   - **Backend**: For API access, go to `http://localhost:8000`


6. **Updating Code**
   If you pull any new code from GitHub while the project is running or already build:
   - You can either rerun the build command to ensure all changes are reflected:
     ```
     docker-compose up -d --build
     ```
   - Or, open the development containers for both the `user-service` and `frontend` containers to see the changes live.
   

7. **Create and Manage Users**
   You can now register `http://localhost:3000/register`, log in `http://localhost:3000/login`, and manage users through the frontend interface.

## License
- This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.