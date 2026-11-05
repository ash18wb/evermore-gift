# 🎁 Evermore Gift

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

A serverless web application that allows users to create, share, and host personalized digital gifts. The app generates custom short links (e.g., `yoursite.com/s/aB3x9Z`) that permanently load the recipient's custom gift directly from a PostgreSQL database.

## ✨ The Experience

* **Tailored Digital Keepsakes:** Design a beautiful, personalized webpage dedicated entirely to your loved one.
* **Frictionless Creation:** An intuitive, clean interface that lets you focus on your memories and message, without any technical hurdles.
* **Elegant Sharing:** Instantly generate a short, clean link to seamlessly deliver your gift via text or direct message.
* **A Permanent Sanctuary:** Their gift lives on a private, dedicated corner of the internet they can bookmark and revisit whenever they want.
* **Distraction-Free:** A pure, ad-free environment designed to make them feel truly special and celebrated.

## ✨ Features
* **Custom Gift Creation:** Users can design personalized digital gifts with a clean UI.
* **Short Link Generation:** Automatically generates a 6-character clean URL slug for sharing.
* **Serverless Backend:** Powered by Vercel Serverless Functions (Node.js).
* **Zero-Config Database:** Automatically initializes the required Supabase (PostgreSQL) tables on the first run.
* **Clean Routing:** Uses `vercel.json` to seamlessly route short links without triggering 404 errors.

## 📂 Project Structure

```text
evermore-gift/
├── api/
│   └── gift.js       # Backend Serverless Function. Handles DB connection, slug generation, and GET/POST routing.
├── index.html        # Main Frontend UI. Contains the creation form and rendering logic for shared links.
├── vercel.json       # Vercel configuration. Sets up clean URL routing (rewrites /s/* to index.html).
├── package.json      # Project dependencies (includes the 'pg' database client).
└── README.md         # Project documentation.

