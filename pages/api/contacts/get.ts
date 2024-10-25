// pages/api/contacts/get.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface QueryParams {
  name?: string | string[];
  email?: string | string[];
  timezone?: string | string[];
  sort?: string | string[];
}

export default async function getContacts(req: NextApiRequest, res: NextApiResponse) {
  const { name, email, timezone, sort } = req.query as QueryParams;

  const where: {
    name?: { contains: string; mode: 'insensitive' };
    email?: { contains: string; mode: 'insensitive' };
    timezone?: { contains: string; mode: 'insensitive' };
  } = {};

  if (name) where.name = { contains: name as string, mode: 'insensitive' };
  if (email) where.email = { contains: email as string, mode: 'insensitive' };
  if (timezone) where.timezone = { contains: timezone as string, mode: 'insensitive' };

  interface OrderBy {
    [key: string]: 'asc' | 'desc'; // Only allows 'asc' or 'desc' as values
  }

  const orderBy: OrderBy = {}; // More specific type
  if (typeof sort === 'string') {
    orderBy[sort] = 'asc'; // Now, TypeScript can check the types
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
