import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../prisma/client';
import { validateSlug, validateUrl } from '../../utils/validators';
import Cors from 'cors';

const cors = Cors({ methods: ['POST'] });

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors);

  const destination = req.body.destination;
  const slug = req.body.slug;
  if (!destination || !slug || typeof destination !== 'string' || typeof slug !== 'string' || req.method !== 'POST') {
    return res.status(400).json({ message: 'something went wrong' });
  }

  if (!validateSlug(slug)) {
    return res.status(500).json({ message: 'invalid slug' });
  }

  if (!validateUrl(destination)) {
    return res.status(404).json({ message: 'invalid destination url' });
  }

  try {
    await prisma.url.create({
      data: { destination, slug },
    });
  } catch (err) {
    return res.status(500).json({ message: 'slug is already taken' });
  }

  return res.status(200).json({ message: 'success!', url: `http://${req.headers.host}/${slug}` });
}
