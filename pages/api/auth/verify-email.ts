// pages/api/auth/verify-email.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function verifyEmail(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET_KEY!) as { userId: number };

    // Find the verification token and associated user
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token: token as string,
      },
      include: {
        user: true,
      },
    });

    // Check if the verification token exists and is not expired
    if (!verificationToken || verificationToken.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Mark the user's email as verified
    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: true },
    });

    // Optionally, delete the token after use
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying email:', error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to verify email' });
  }
}
