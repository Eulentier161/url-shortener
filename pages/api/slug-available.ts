import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse<boolean>) {
  const slug = req.query.slug;
  if (typeof slug !== 'string' || req.method !== 'GET') return res.status(400).send(false);
  if (await prisma.url.findUnique({ where: { slug } })) return res.status(200).send(false);
  return res.status(200).send(true);
}
