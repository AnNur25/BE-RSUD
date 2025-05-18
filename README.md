# 🏥 Capstone RS-Balung Backend

A clean and modular **Express.js** backend application for RSUD (Rumah Sakit Umum Daerah), designed using the principles of **Clean Architecture**.

## 📦 Tech Stack

## Tech Stack

- **Node.js** with **Express.js** (`express`) — lightweight web framework  
- **Prisma ORM** (`prisma`, `@prisma/client`) — modern ORM for database access  
- **JWT** (`jsonwebtoken`) — secure authentication  
- **PostgreSQL / Supabase** — relational database  
- **bcrypt** (`bcrypt`) — password hashing  
- **Session Management** (`express-session`) — manage user sessions  
- **Cookie Handling** (`cookie-parser`, `cookie-signature`) — handle and sign cookies  
- **CORS** (`cors`) — enable cross-origin resource sharing  
- **Environment Configuration** (`dotenv`) — manage environment variables  
- **File Upload** (`multer`) — handle multipart/form-data  
- **Image Processing** (`sharp`) — resize and optimize images  
- **Email Sending** (`nodemailer`) — send emails via SMTP  
- **Task Scheduling** (`node-cron`) — schedule automated tasks  
- **Google OAuth** (`passport`, `passport-google-oauth20`) — Google login authentication  
- **Auto Reload During Development** (`nodemon`) — auto-reload server during development  
- **API Documentation** (`swagger-jsdoc`, `swagger-ui-express`, `swagger-ui-dist`) — auto-generate API docs  
- **HTTP Requests** (`request`, `request-promise`) — make HTTP requests (deprecated)  
- **Timezone Handling** (`moment-timezone`) — manage and convert timezones  


```bash
📦 Capstone-RSUD/
├── 📁 node_modules/            # Folder dependensi npm (auto-generated)
│
├── 📂 src/                     # Source code utama
│   ├── 🛠️ configs/            # Konfigurasi global (DB, CORS, dll)
│   ├── 🧠 controllers/         # Logic untuk handle HTTP request
│   ├── 🧩 services/            # Business logic (dipanggil controller)
│   ├── 🚦 routes/              # Definisi endpoint / rute aplikasi
│   ├── 🔧 prisma/              # File schema & konfigurasi Prisma ORM
│   ├── 🛡️ middlewares/        # Middleware Express (auth, error handler, dll)
│   └── 🧰 utils/               # Fungsi bantu (validator, helper, dll)
│
├── 🧪 test/                    # Folder untuk integration / unit testing
│
├── 🖼️ uploads/                 # Tempat penyimpanan file upload
│   └── 📏 resized/             # Hasil resize gambar (via sharp)
│
├── 📄 .env                     # Variabel lingkungan (PORT, DB_URL, dll)
├── 📄 .gitignore               # File & folder yang tidak di-push ke Git
├── 🚀 app.js                   # Entry point Express.js
└── 📜 package.json             # Info project & daftar dependensi
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
