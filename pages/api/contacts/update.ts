// pages/api/contacts/update/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function updateContact(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { name, email, phoneNumber, address, timezone } = req.body;

    const contact = await prisma.contact.update({
      where: { id: Number(id) },
      data: {
        name,
        email,
        phoneNumber,
        address,
        timezone,
      },
    });

    res.status(200).json(contact);
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
