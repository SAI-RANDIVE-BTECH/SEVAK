# SEVAK - Healthcare Assistance Web App

## "Stay tension free as we are your SEVAK!"

![Animated Login and Register Form with blur effect](https://github.com/example/repo/assets/images/Animated-Login-and-Register-Form-with-blur-effect.jpg)
*(Note: Replace the image URL with a link to your project's screenshot or a relevant image hosted in your GitHub repo.)*

## Table of Contents

1.  [Project Overview](#1-project-overview)
2.  [Features](#2-features)
3.  [UI/UX Design Philosophy](#3-uiux-design-philosophy)
4.  [Technology Stack](#4-technology-stack)
    * [Backend](#backend)
    * [Frontend](#frontend)
    * [Database](#database)
    * [Tools](#tools)
5.  [Project Structure](#5-project-structure)
6.  [Setup & Installation](#6-setup--installation)
    * [Prerequisites](#prerequisites)
    * [Backend Setup](#backend-setup)
    * [Frontend Setup](#frontend-setup)
    * [Database Seeding](#database-seeding)
7.  [How to Run the Application](#7-how-to-run-the-application)
8.  [Key API Endpoints](#8-key-api-endpoints)
9.  [Payment Simulation Details](#9-payment-simulation-details)
10. [Market Survey & Pricing Strategy](#10-market-survey--pricing-strategy)
11. [Important Notes / Architectural Decisions](#11-important-notes--architectural-decisions)
12. [Future Enhancements](#12-future-enhancements)
13. [License](#13-license)
14. [Contact](#14-contact)

---

## 1. Project Overview

SEVAK is a comprehensive web application designed to connect individuals in India needing various healthcare assistance services with qualified and compassionate service providers. From daily medical tasks like bathing and medication management to night care in hospitals and post-surgery support, SEVAK aims to provide reliable, professional, and accessible home and hospital care.

The application caters to two primary user groups:
* **Customers:** Individuals and families seeking reliable and professional home healthcare or hospital support.
* **Service Providers (Caretakers/Nurses):** Qualified professionals looking for opportunities to offer their services. (Management of caretakers is primarily admin-driven in this version).

## 2. Features

* **User Authentication:** Secure registration, login, and logout for customers and (conceptually) caretakers/admins.
* **Wallet System (Simulated):** Users receive an initial Rs 1000 balance upon signup. Booking costs are deducted from this wallet.
* **Predefined Service Catalog:** Browse a comprehensive list of healthcare services (e.g., Hospital Companion, Home Patient Care, Medication Management, Night Care, Post-Surgery Care, Elderly Care).
* **Detailed Booking Process:**
    * Select a service from the catalog.
    * Fill out a comprehensive "Patient Details Form" including personal information, service location (with conceptual geocoding for lat/lon), medical history, current medications, allergies, special instructions, and emergency contact.
    * Specify preferred service date, time, and duration.
* **Simulated Payment Gateway:** Upon booking, the total cost is deducted from the customer's simulated wallet.
* **Booking Confirmation & Receipt:** After successful booking, a popup displays a confirmation message, booking details, and the new wallet balance.
* **Booking Management:**
    * Customers can view their own booking history.
    * Customers can cancel "Pending" or "Confirmed" bookings with an automatic refund to their wallet.
    * (Admin/Caretaker) Update booking status.
* **User Dashboard:** Personalized dashboard for users to view their wallet balance and manage their bookings.
* **Informative Pages:** "About Us" and "Contact Us" pages.
* **Static Legal Pages:** "Privacy Policy," "Terms of Service," "Medical Disclaimer," and "Licensing" served as traditional HTML files.
* **Responsive UI:** Adapts seamlessly to various screen sizes (desktop, tablet, mobile).

## 3. UI/UX Design Philosophy

The application's design is crafted with a modern, creative, and compassionate aesthetic, balancing warmth with efficiency.

* **Overall Aesthetic:** Clean, professional, and intuitive design that instills trust and comfort.
* **Color Gradients:** Strategic use of gradients for backgrounds and buttons to add depth and a modern flair, reflecting the specified color palette.
* **Animations:** Subtle hover effects on interactive elements, smooth transitions (conceptual for React Router), and dynamic background elements for an immersive feel.
* **3D Icons/Elements:** Conceptual integration of stylized 3D elements, particularly on the home page hero section and within the Login/Signup modal, to provide a contemporary and engaging visual experience.
* **Layouts:** Spacious, well-structured, and fully responsive layouts that prioritize readability and ease of navigation on all devices.
* **Glassmorphism:** A key design element for the Login/Signup modal, featuring frosted glass-like backgrounds, providing a sophisticated and modern touch.

### Color Palette

| Name                      | Hex Code  | Usage                                     |
| :------------------------ | :-------- | :---------------------------------------- |
| Primary Accent (Red/Coral)| `#E84F5E` | CTAs, highlights, important status        |
| Light Background/Cream    | `#FCDFC5` | Secondary backgrounds, cards              |
| Strong Heading/Accent     | `#5C0E14` | Primary headings, strong accents          |
| Secondary Accent/Highlight| `#F0E193` | Subtle highlights, decorative elements    |
| Very Light Background/Cream| `#F3E5C3` | Main background                           |
| Professional/Navigation   | `#174E4F` | Navigation bars, professional elements    |
| Success/Lively Accent     | `#8ED968` | Success messages, positive indicators     |
| Deep Background/Text      | `#103C1F` | Body text, deep backgrounds               |

### Fonts

* **For "SEVAK" name & tagline (logo):** `'Bebas Neue'` (substitute for 'OHHO').
* **For all other text:** `'Reddit Sans'`.

## 4. Technology Stack

### Backend

* **Node.js:** JavaScript runtime environment for server-side logic.
* **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
* **MongoDB:** NoSQL database for flexible data storage.
* **Mongoose:** ODM (Object Data Modeling) for MongoDB and Node.js.
* **bcryptjs:** For secure password hashing.
* **jsonwebtoken (JWT):** For stateless user authentication and authorization.
* **cookie-parser:** Middleware for parsing and managing cookies (HTTP-only JWTs).
* **cors:** Middleware for enabling Cross-Origin Resource Sharing.
* **dotenv:** For loading environment variables.
* **express-async-handler:** Simplifies asynchronous error handling in Express routes.
* **validator:** For input validation (e.g., email format).

### Frontend

* **ReactJS:** JavaScript library for building user interfaces.
* **React Router DOM:** For client-side routing and navigation.
* **Axios:** Promise-based HTTP client for making API requests.
* **Leaflet.js & React-Leaflet:** For interactive maps (OpenStreetMap integration for location display).
* **CSS Modules:** For scoped, component-level styling.
* **Vanilla CSS:** For global styles and static HTML pages.

### Database

* **MongoDB Atlas:** Cloud-hosted MongoDB database for scalability and accessibility.

### Tools

* **Nodemon:** Automatically restarts Node.js server on file changes (development).
* **Figma:** (Conceptual) For comprehensive UI/UX design and component library.
* **Git:** For version control.

## 5. Project Structure