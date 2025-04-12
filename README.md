# 🏥 Capstone RS-Balung Backend

A clean and modular **Express.js** backend application for RSUD (Rumah Sakit Umum Daerah), designed using the principles of **Clean Architecture**.

## 📦 Tech Stack

## Tech Stack

- **Node.js** with **Express.js** (`express`) — lightweight web framework
- **Prisma ORM** (`prisma`, `@prisma/client`) — modern ORM for database access
- **JWT** (`jsonwebtoken`) — secure authentication
- **PostgreSQL / Supabase** — relational database
- **bcrypt** (`bcrypt`) — password hashing
- **CORS** (`cors`) — enable cross-origin resource sharing
- **Environment Configuration** (`dotenv`) — manage environment variables
- **Session Management** (`express-session`) — manage user sessions
- **Image Upload & CDN** (`imagekit`) — handle image uploads
- **File Upload** (`multer`) — handle multipart/form-data
- **Email Sending** (`nodemailer`) — send emails via SMTP
- **Auto Reload During Development** (`nodemon`) — live-reload server
- **API Documentation** (`swagger-jsdoc`, `swagger-ui-express`) — auto-generate API docs from comments

```bash
Capstone-RSUD/
├── src/
│   ├── configs/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── prisma/
│   ├── middlewares/
│   └── utils/
│
├── test/
├── .env
├── .gitignore
├── app.js
└── package.json
```

## Installation

### Prerequisites

Before installing, ensure you have the following prerequisites installed on your system:

- **Node.js**: The project requires Node.js to run. You can download it from Node.js official website.
- **npm**: npm (Node Package Manager) is used to manage the dependencies and should come installed with Node.js.

### Installing Dependencies

To set up the project for development on your local machine, please follow the steps below:

1. First, clone this repository to your local machine using Git commands. For example:

```bash
   git clone https://github.com/AnNur25/BE-RSUD.git
    cd capstone-rsud
```

2. Run the following command in the root directory of the project to install all necessary dependencies:

   `npm install`

## Starting the App

### Running the Application

Once the installation is complete, you can start the application using one of the following methods:

1. **npm**

   Automatically start using **nodemon** (if you have installed all the required dependencies and configured the value of "start" under the "scripts" to "nodemon app.js" in `package.json` file).

   `npm start`

2. **Directly using Node.js or nodemon**

   `node index.js` or `nodemon index.js`

## 🛠️ Configuring `.env`

Buat file `.env` di root project dan isi dengan variabel-variabel berikut:

```env
# Database connection string
DATABASE_URL=""

# Server port
PORT=

# JWT secret key for authentication
JWT_SECRET=

# ImageKit configuration
IMAGEKIT_PUBLICKEY=""
IMAGEKIT_PRIVATEKEY=""
IMAGEKIT_URL=""

# Email credentials for Nodemailer or similar service
EMAIL_USER=
EMAIL_PASS=

# Frontend application URL (for CORS or redirect links)
FRONTEND_URL=""
```

## Database
1. Run `npx prisma migrate dev` in the **capstone-rsud/src/** directory.
2. Wait for the database migration to be completed.
3. Voila, your database is ready!
4. After that, Run `npm run seed` in the **capstone-rsud** directory.
5. Ta-da, you have some data in your database!


## ‍💻 Author
Ahmad Farid Zainudin
