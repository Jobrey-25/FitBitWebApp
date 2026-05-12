# FitBit Gym Membership Management System

A complete modern gym management application built with React, Tailwind CSS, and Firebase.

## 🚀 Getting Started

This application is ready to use in the AI Studio environment. It uses **Firebase** for authentication and database management.

### Features
- **User Authentication**: Secure Sign-in and Sign-up via Google.
- **Member Portal**: Manage your profile, select membership plans, and track payments.
- **Gym Plans**: Choose between Monthly, Quarterly, and Annual tiers.
- **Trainer Bookings**: View elite trainers and book training sessions.
- **Admin Dashboard**: Manage members, approve/decline membership applications, and read support messages.
- **Contact System**: Direct communication channel with gym management.

## 🛠 Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS 4
- **Database & Auth**: Firebase Firestore & Firebase Auth
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🔑 Admin Access
By default, new users are assigned the `member` role. To access the **Admin Dashboard**:
1. Sign in to the app once.
2. Open your Firebase Console (link available in the chat).
3. Go to the `admins` collection.
4. Create a document with your User ID (available in your Profile) as the document ID.
5. Alternatively, the system is configured to recognize the primary developer email as an admin.

## 📁 Project Structure
- `/src/lib/firebase.ts`: Firebase configuration and initialization.
- `/src/pages/`: Contains all application views (Home, Dashboard, etc.).
- `/src/types.ts`: System-wide TypeScript interfaces.
- `/src/lib/error-handler.ts`: Structured Firestore error reporting.

## 📜 Security Rules
The system includes hardened Firestore Security Rules preventing unauthorized access to member data and securing the admin portal.

---
Built by NA Matlhakwana for the FitBit Gym System.
