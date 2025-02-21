
# CryptiChat - Secure Full-Stack Real-Time Messaging

![image](https://github.com/user-attachments/assets/fff071cd-cec4-4408-950f-5d50495bf6aa)


# MERN Chat App

A modern, real-time chat application built with the MERN stack, featuring live messaging, user authentication, and cloud storage integration.

## Features

- **Tech Stack:** MERN (MongoDB, Express, React, Node.js) + Socket.io + TailwindCSS + DaisyUI
- **Authentication & Authorization:** Secure login and registration with JWT
- **Real-Time Messaging:** Instant chat powered by Socket.io
- **Online User Status:** See who’s online in real-time
- **Global State Management:** Handled efficiently using Zustand
- **Robust Error Handling:** Implemented on both server and client sides
- **Production-Ready Deployment:** Deploy your app for free
- **End 2 End Encryption:** Robust security with e2e asymmetric encryption

## Setup & Configuration



### 1. Install Dependencies
```sh
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and add the following:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5001
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

NODE_ENV=development
```

### 3. Build the Application
```sh
npm run build
```

### 4. Start the Server
```sh
npm start
```
