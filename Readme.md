# MongoDB Backup and Email Node.js Server

## Overview

This Node.js server is designed to perform MongoDB backup and send the backup file via email. It uses [Mongoose](https://mongoosejs.com/) for MongoDB connectivity, [Node-cron](https://www.npmjs.com/package/node-cron) for scheduling cron jobs, [Nodemailer](https://nodemailer.com/) for sending emails, and [Archiver](https://www.npmjs.com/package/archiver) for compressing backup files.

## Prerequisites

- Node.js and npm installed
- MongoDB installed
- Gmail account for sending emails (or any other SMTP service)
- MongoDB connection URI and credentials
- SMTP credentials for sending emails

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sharma39vishal/Mongodb-Backup.git
   cd your-repo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and configure the following variables:

   ```env
   MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/your-database-name
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-email-password
   RECIPIENT_EMAIL=recipient@example.com
   ```

## Usage

- Run the server:

  ```bash
  node index.js
  ```

- The server will start running on the specified port (default is 3000) and execute the specified cron job every day at 23:29 to fetch data from MongoDB, create a backup file, compress it, and send it via email.

## Configuration

- Adjust the cron schedule in the `cron.schedule` function call in `index.js` to suit your backup frequency.

## Cleanup

- Ensure to handle sensitive information securely, and consider using environment variables for production deployment.
- Thoroughly test the server before deploying it in a production environment.
