import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { audioValidationSchema } from 'validationSchema/audio';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getAudio();
    case 'POST':
      return createAudio();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getAudio() {
    const data = await prisma.audio
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'audio'));
    return res.status(200).json(data);
  }

  async function createAudio() {
    await audioValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.rating?.length > 0) {
      const create_rating = body.rating;
      body.rating = {
        create: create_rating,
      };
    } else {
      delete body.rating;
    }
    const data = await prisma.audio.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
