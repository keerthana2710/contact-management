This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# Contact Management API

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technologies Used](#technologies-used)
3. [Setup Instructions](#setup-instructions)
4. [Running the Backend Server](#running-the-backend-server)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Database Setup](#database-setup)
8. [Contributing](#contributing)
9. [License](#license)

## Project Overview
This project is a Contact Management API built with Next.js and Prisma. It allows users to register, verify their email, and manage their contacts.

## Technologies Used
- **Next.js**: Framework for server-rendered React applications
- **Prisma**: ORM for database access
- **PostgreSQL**: Database used for storing user and contact data
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT for authentication
- **nodemailer**: For sending emails

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd contact-management-app
Install Dependencies :

npm install

Environment Variables Create a .env file in the root of the project and add the following variables:

env


DATABASE_URL="your_database_url"
JWT_SECRET_KEY="your_jwt_secret"
EMAIL_USER="your_email"
EMAIL_PASS="your_email_password"
Running the Backend Server
To start the development server, run:

bash

npm run dev
The server will be running at http://localhost:3000.


##Api endpoints
Authentication End Points :

   https://contact-management-47g3.vercel.app/api/auth/register
   https://contact-management-47g3.vercel.app/api/auth/login
   https://contact-management-47g3.vercel.app/api/auth/verify-email
   https://contact-management-47g3.vercel.app/api/auth/request-reset-password

Contact management End points :
   https://contact-management-47g3.vercel.app/api/contacts/add
   https://contact-management-47g3.vercel.app/api/contacts/get
   https://contact-management-47g3.vercel.app/api/contacts/update?id=${}
   https://contact-management-47g3.vercel.app/api/contacts/delete?id=${}



   
