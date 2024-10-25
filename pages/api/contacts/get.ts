// pages/api/contacts/get.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function getContacts(req: NextApiRequest, res: NextApiResponse) {
  const { name, email, timezone, sort } = req.query;

  const where: any = {};
  if (name) where.name = { contains: name as string, mode: 'insensitive' };
  if (email) where.email = { contains: email as string, mode: 'insensitive' };
  if (timezone) where.timezone = { contains: timezone as string, mode: 'insensitive' };

  const orderBy: any = {};
  if (typeof sort === 'string') {
    orderBy[sort] = 'asc';
  }

  try {
    const contacts = await prisma.contact.findMany({
      where,
      orderBy: Object.keys(orderBy).length ? orderBy : undefined,
    });

    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error retrieving contacts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
