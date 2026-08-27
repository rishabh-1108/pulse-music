import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../types';
import { AppError, asyncHandler } from '../utils/errors';
import { sendSuccess } from '../utils/response';
import { createSlug } from '../utils/helpers';

export const getGenres = asyncHandler(async (_req: Request, res: Response) => {
  const genres = await prisma.genre.findMany({
    include: { _count: { select: { songs: true, albums: true, artists: true } } },
    orderBy: { name: 'asc' },
  });
  sendSuccess(res, genres);
});

export const getGenreById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const genre = await prisma.genre.findUnique({
    where: { id },
    include: {
      _count: { select: { songs: true, albums: true, artists: true } },
      songs: {
        take: 20,
        orderBy: { playCount: 'desc' },
        include: {
          artist: { select: { id: true, name: true, slug: true, avatar: true, verified: true } },
          _count: { select: { likes: true } },
        },
      },
    },
  });
  if (!genre) throw new AppError('Genre not found', 404);
  sendSuccess(res, genre);
});

export const createGenre = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, description, image, color } = req.body;
  const slug = createSlug(name);

  const existing = await prisma.genre.findUnique({ where: { slug } });
  if (existing) throw new AppError('Genre already exists', 409);

  const genre = await prisma.genre.create({ data: { name, slug, description, image, color } });
  sendSuccess(res, genre, 201);
});

export const updateGenre = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { name, description, image, color } = req.body;

  const genre = await prisma.genre.update({ where: { id }, data: { name, description, image, color } });
  sendSuccess(res, genre);
});

export const deleteGenre = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  await prisma.genre.delete({ where: { id } });
  sendSuccess(res, { message: 'Genre deleted successfully' });
});
