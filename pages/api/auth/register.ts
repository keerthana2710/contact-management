// pages/api/auth/register.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: 'Gmail',  // This works with Gmail, but you may need to enable "less secure apps" or use OAuth2 for better security
  auth: {
    user: process.env.EMAIL_USER,  // Your Gmail address
    pass: process.env.EMAIL_PASS,  // App-specific password for Gmail
  },
});

// Function to send the verification email
async function sendVerificationEmail(email: string, token: string) {
  const url = `http://localhost:3000/verify-email?token=${token}`;  // URL with the token for email verification

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,  // Sender address
      to: email,                     // Recipient's email address
      subject: 'Verify your email',   // Subject line
      html: `<p>Please click the link below to verify your email:</p>
             <a href="${url}">Verify Email</a>`,  // HTML content for the email
    });

    console.log('Verification email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Rate limiter variables
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = 5; // Max requests
const TIME_WINDOW = 60 * 1000; // 1 minute

// Rate limiter middleware
const rateLimiter = (req: NextApiRequest) => {
  const ip = req.headers['x-real-ip'] || req.socket.remoteAddress; // Get client IP
  const currentTime = Date.now();

  if (!rateLimitMap.has(ip as string)) {
    rateLimitMap.set(ip as string, { count: 1, timestamp: currentTime });
  } else {
    const requestData = rateLimitMap.get(ip as string)!;

    // Check if the time window has passed
    if (currentTime - requestData.timestamp > TIME_WINDOW) {
      // Reset count and timestamp
      requestData.count = 1;
      requestData.timestamp = currentTime;
    } else {
      requestData.count += 1; // Increment count

      // Check if the request limit is exceeded
      if (requestData.count > RATE_LIMIT) {
        return true; // Rate limit exceeded
      }
    }
  }
  return false; // Rate limit not exceeded
};

export default async function register(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Check rate limit
    if (rateLimiter(req)) {
      return res.status(429).json({ error: 'Too many registration attempts, please try again later.' });
    }

    const { email, password, name } = req.body;

    // Input validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Generate a verification token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY!, {
      expiresIn: '1h',
    });

    // Store the verification token in the database
    await prisma.verificationToken.create({
      data: {
        token,
        type: 'emailVerification',
        expiresAt: new Date(Date.now() + 3600000), // Token expires in 1 hour
        userId: user.id,
      },
    });

    // Send verification email
    await sendVerificationEmail(email, token);

    // Send response
    res.status(201).json({ message: 'User registered successfully.', token });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
