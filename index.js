const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const archiver = require('archiver');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const backupFileName = 'database_backup.json';
const backupFilePath = path.join(__dirname, backupFileName);

const mailsender = async () => {
    // Configure email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECIPIENT_EMAIL,
        subject: 'MongoDB Backup',
        text: 'Attached is the MongoDB backup.',
        attachments: [
            {
                filename: backupFileName,
                path: backupFilePath,
            },
        ],
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.response);
};

const backupandmail = async () => {
    try {
        // Fetch data from MongoDB
        await mailsender();
        const collections = await mongoose.connection.db.listCollections().toArray();

        const backupData = {};

        for (const collection of collections) {
            const collectionName = collection.name;
            const collectionData = await mongoose.connection.db.collection(collectionName).find().toArray();
            backupData[collectionName] = collectionData;
        }

        // Create a backup file
        fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2), 'utf8');


    } catch (error) {
        console.error('Error during cron job:', error);
    }
};


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('MongoDB connected');



        // Schedule cron job to run every 8 hours
        cron.schedule('0 */12 * * *', backupandmail);


        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
