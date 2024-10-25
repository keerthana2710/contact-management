import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

// Rate limiter variables
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = 5; // max requests
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  // Check rate limit
  if (rateLimiter(req)) {
    return res.status(429).json({ error: 'Too many login attempts, please try again later.' });
  }

  const { email, password } = req.body;

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Check if password matches
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Check if email is verified
  if (!user.emailVerified) {
    return res.status(403).json({ error: 'Email not verified' });
  }

  // Generate JWT
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY!, {
    expiresIn: '1h',
  });

  // Store the token in the database
  await prisma.verificationToken.create({
    data: {
      token,
      type: 'JWT',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // Token expiration (1 hour)
      userId: user.id,
    },
  });

  res.status(200).json({ token });
}
