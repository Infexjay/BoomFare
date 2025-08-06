# BoomFare Messenger – A Next-Gen Messaging Platform

BoomFare Messenger is a modern, secure, and vibe-heavy messaging web app, designed for Nigerian and global Gen Z users who want speed, privacy, and style — all in one clean package. Inspired by WhatsApp, built for the now.

## 🧠 Tech Stack

### 🎨 Frontend
- **Next.js (App Router):** Core React framework with file-based routing.
- **Tailwind CSS:** Utility-first styling with full custom theme support.
- **Zustand / Context API:** Lightweight state management.
- **Lucide / Heroicons:** Sleek, minimal SVG icon packs.
- **Framer Motion:** Smooth Gen Z-style animations and page transitions.

### 🚀 Backend
- **Supabase (PostgreSQL):** Relational database for users, messages, verification, etc.
- **Prisma ORM:** Next-generation ORM for Node.js and TypeScript.
- **NextAuth.js (JWT):** Authentication via Email and Google.
- **Pusher:** Real-time chat and presence updates.
- **Firebase Storage:** Encrypted media storage (images/files).
- **Next.js API Routes / REST:** API handling and backend logic.
- **Stripe Integration:** Payment handling for verification system.

## 🔐 Security Features
- **JWT Auth:** Secure token-based session system.
- **CSRF Protection:** Cross-site request forgery defense.
- **Input Sanitization:** On both frontend and backend.
- **Rate Limiting:** To prevent spam & abuse.
- **End-to-End Encryption (Media Only):** Only sender & receiver can access shared media.

## 💎 Verification Badge System
- **Lifetime:** ₦5,000 – ₦20,000 (one-time)
- **Monthly:** ₦1,000 – ₦5,000 (recurring)
- **Celebrity / Influencer:** Free (Admin-granted)

## 🔄 Chat & Account Features
- One-to-One Chat
- Encrypted Media Sharing
- Real-time Online Status
- Seen / Delivered Ticks
- Typing Indicators
- Message Timestamps
- Custom Username, Profile Photo, and Bio
- Default Dark Mode UI
- Login via Email or Google
- Verified Badge Display

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or later)
- Yarn
- A Supabase project
- A Google Cloud project for Google authentication
- A Pusher account
- A Firebase project
- A Stripe account

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/boomfare-messenger.git
    cd boomfare-messenger
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    -   Create a `.env.local` file by copying the `.env.example` file.
    -   Fill in the required credentials for Supabase, NextAuth.js, Pusher, Firebase, and Stripe.
4.  **Sync the database schema:**
    ```bash
    npx prisma db push
    ```
5.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000`.

## 🔮 Future Add-Ons
- Group chats with admin roles & message pinning
- Emojis / Stickers + Giphy/Gfycat integration
- Scheduled messages / auto-replies
- Optional server-side media backups for premium users
