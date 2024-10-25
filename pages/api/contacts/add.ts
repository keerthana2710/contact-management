// pages/api/contacts/add.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function addContact(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id,name, email, phoneNumber, address, timezone } = req.body;

    // Validate input
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const userId = id;

    // Create contact
    try {
      const contact = await prisma.contact.create({
        data: {
          name,
          email,
          phoneNumber,
          address,
          timezone,
          userId, // Include userId here
        },
      });

      res.status(201).json(contact);
    } catch (error) {
      console.error('Error creating contact:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
