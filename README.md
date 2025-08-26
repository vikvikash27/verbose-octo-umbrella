# EasyOrganic E-commerce Platform

Welcome to the EasyOrganic project! This repository contains the full source code for an e-commerce platform, including a backend server, a web-based admin and customer portal, and a cross-platform mobile application.

## Project Structure

This project is a monorepo organized into three main parts:

-   `./backend`: A Node.js and Express server with Socket.IO for real-time updates. It serves a REST API and uses **MongoDB** for data persistence.
-   `./web-app`: A modern React web application built with Vite and styled with Tailwind CSS. It contains both the public-facing customer storefront and the protected admin dashboard for managing the store.
-   `./mobile-app`: A React Native mobile application built with Expo. It provides a native shopping experience for customers on iOS and Android.

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

-   **Node.js**: Version 18.x or later is recommended. You can download it from [nodejs.org](https://nodejs.org/).
-   **npm**: The Node Package Manager, which comes bundled with Node.js.
-   **MongoDB**: A running instance of MongoDB. You can install it locally or use a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
-   **Expo Go App** (for Mobile App): Install the "Expo Go" app on your iOS or Android device to run the mobile app without a full build process.

---

## Environment Setup

You need to configure environment variables for the web and mobile apps to function correctly.

### 1. Backend (MongoDB, JWT & Firebase)

The backend uses MongoDB, JWT for authentication, and the Firebase Admin SDK for verifying mobile OTP logins.

1.  **Configure MongoDB & JWT:**
    -   Navigate to the `backend` directory: `cd backend`
    -   Create a new `.env` file: `touch .env`
    -   Open the new `.env` file and add the following variables:
        ```
        MONGO_URI="your_mongodb_connection_string"
        JWT_SECRET="a_very_strong_and_secret_key_for_jwt"
        ```

2.  **Configure Firebase Admin SDK:**
    -   Go to your [Firebase Console](https://console.firebase.google.com/), select your project, go to **Project settings > Service accounts**.
    -   Click **Generate new private key** to download a JSON credentials file.
    -   **Rename the downloaded file to `service-account-key.json`**.
    -   Place this file directly inside your `./backend` directory.

### 2. Web App (Google Maps API)

The web app uses the Google Maps Platform for its location picker.

1.  Navigate to the `web-app` directory: `cd web-app`
2.  Create a new `.env` file by copying the example file: `cp .env.example .env`
3.  Open the new `.env` file and replace the placeholder value with your actual API key.

### 3. Mobile App (API & Firebase)

The mobile app needs your computer's IP address to connect to the backend and your Firebase project's web configuration.

1.  **Find your computer's local IP address:**
    -   On **macOS/Linux**, run `ifconfig | grep "inet "`.
    -   On **Windows**, run `ipconfig`.
    -   It will look something like `192.168.1.10`.

2.  Open the file `mobile-app/src/api/config.ts` and replace `YOUR_COMPUTER_IP` with the IP address you found.
    > **Important**: Your computer and your mobile phone must be connected to the **same Wi-Fi network**.

3.  **Configure Firebase Client SDK:**
    -   In your Firebase Console, go to **Project settings > General**.
    -   Under "Your apps," click the Web icon (`</>`) to create a web app configuration.
    -   Copy the `firebaseConfig` object provided.
    -   Open the file `mobile-app/src/firebaseConfig.ts` and replace the placeholder object with the one you just copied.

---

## Running the Application

To run the full stack, you will need to open three separate terminal windows.

### Terminal 1: Start the Backend Server

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies and start the server. The `npm start` script conveniently does both.
    ```bash
    npm start
    ```
3.  The server will be running at `http://localhost:3001`. Keep this terminal open.

### Terminal 2: Start the Web Application

1.  Navigate to the `web-app` directory:
    ```bash
    cd web-app
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite development server:
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to the local URL shown in the terminal (usually `http://localhost:5173`).

### Terminal 3: Start the Mobile Application

1.  Navigate to the `mobile-app` directory:
    ```bash
    cd mobile-app
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the Expo development server:
    ```bash
    npm start
    ```
4.  A QR code will appear in your terminal. Scan this QR code with the **Expo Go app** on your mobile phone to launch the app.