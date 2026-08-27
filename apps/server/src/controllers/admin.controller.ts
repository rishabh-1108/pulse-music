import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest, PaginationQuery } from '../types';
import { asyncHandler } from '../utils/errors';
import { sendSuccess, sendPaginatedResponse } from '../utils/response';
import { getPaginationParams } from '../utils/helpers';

export const getDashboardStats = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const [totalUsers, totalArtists, totalSongs, totalAlbums, totalPlaylists, recentUsers, topSongs, totalPlaysAggregate] =
    await Promise.all([
      prisma.user.count(),
      prisma.artist.count(),
      prisma.song.count(),
      prisma.album.count(),
      prisma.playlist.count(),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, username: true, displayName: true, avatar: true, createdAt: true },
      }),
      prisma.song.findMany({
        orderBy: { playCount: 'desc' },
        take: 5,
        select: { id: true, title: true, playCount: true, artist: { select: { name: true } } },
      }),
      prisma.song.aggregate({ _sum: { playCount: true } }),
    ]);

  sendSuccess(res, {
    totalUsers,
    totalArtists,
    totalSongs,
    totalAlbums,
    totalPlaylists,
    totalPlays: totalPlaysAggregate._sum.playCount || 0,
    recentUsers,
    topSongs,
  });
});

export const getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query as PaginationQuery);
  const { search, role } = req.query;

  const where: any = {};
  if (search) {
    where.OR = [
      { username: { contains: search as string, mode: 'insensitive' } },
      { email: { contains: search as string, mode: 'insensitive' } },
      { displayName: { contains: search as string, mode: 'insensitive' } },
    ];
  }
  if (role) where.role = role as string;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true, email: true, username: true, displayName: true, avatar: true,
        role: true, subscription: true, isVerified: true, createdAt: true, lastLoginAt: true,
        _count: { select: { followers: true, playlists: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  sendPaginatedResponse(res, users, total, page, limit);
});

export const updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { role, subscription, isVerified } = req.body;

  const user = await prisma.user.update({
    where: { id },
    data: { role, subscription, isVerified },
    select: {
      id: true, email: true, username: true, displayName: true, role: true,
      subscription: true, isVerified: true,
    },
  });

  sendSuccess(res, user);
});

export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  await prisma.user.delete({ where: { id } });
  sendSuccess(res, { message: 'User deleted successfully' });
});

export const getAdminArtists = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query as PaginationQuery);

  const [artists, total] = await Promise.all([
    prisma.artist.findMany({
      include: {
        user: { select: { id: true, email: true, avatar: true } },
        _count: { select: { songs: true, albums: true, genres: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.artist.count(),
  ]);

  sendPaginatedResponse(res, artists, total, page, limit);
});

export const getAdminSongs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query as PaginationQuery);
  const { search } = req.query;

  const where: any = {};
  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { artist: { name: { contains: search as string, mode: 'insensitive' } } },
    ];
  }

  const [songs, total] = await Promise.all([
    prisma.song.findMany({
      where,
      include: {
        artist: { select: { id: true, name: true, slug: true } },
        album: { select: { id: true, title: true } },
        _count: { select: { likes: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.song.count({ where }),
  ]);

  sendPaginatedResponse(res, songs, total, page, limit);
});

export const getAdminAlbums = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query as PaginationQuery);

  const [albums, total] = await Promise.all([
    prisma.album.findMany({
      include: {
        artist: { select: { id: true, name: true, slug: true } },
        _count: { select: { songs: true, likes: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.album.count(),
  ]);

  sendPaginatedResponse(res, albums, total, page, limit);
});
