import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(410).json({ error: 'Endpoint legado desativado: não há collection Appwrite oficial para este recurso.' });
}