import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { sendPasswordResetEmail } from '../../../lib/email';


const prisma = new PrismaClient();

export default async function requestResetPassword(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email } = req.body;

      // Validate input
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Check if the user exists
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'User with this email does not exist.' });
      }

      // Generate a reset token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY!, {
        expiresIn: '1h', // Token expires in 1 hour
      });

      // Send password reset email
      await sendPasswordResetEmail(email, token);

      return res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error('Error requesting password reset:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
