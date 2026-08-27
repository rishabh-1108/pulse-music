import { Request, Response } from "express";
import prisma from "../config/database";
import { AuthRequest, PaginationQuery } from "../types";
import { AppError, asyncHandler } from "../utils/errors";
import { sendSuccess, sendPaginatedResponse } from "../utils/response";
import { getPaginationParams, createSlug } from "../utils/helpers";

const SONG_INCLUDE = {
  artist: {
    select: {
      id: true,
      name: true,
      slug: true,
      avatar: true,
      verified: true,
    },
  },
  album: {
    select: {
      id: true,
      title: true,
      slug: true,
      coverImage: true,
    },
  },
  genre: true,
  _count: {
    select: {
      likes: true,
    },
  },
};

export const getSongs = asyncHandler(async (req: Request, res: Response) => {
  const { genre, artistId, albumId, search } = req.query as Record<string, string | undefined>;
  const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(req.query as PaginationQuery);

  const where: Record<string, any> = {};

  if (genre) {
    where.genre = { slug: genre };
  }

  if (artistId) {
    where.artistId = artistId;
  }

  if (albumId) {
    where.albumId = albumId;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { artist: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [songs, total] = await Promise.all([
    prisma.song.findMany({
      where,
      include: SONG_INCLUDE,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.song.count({ where }),
  ]);

  sendPaginatedResponse(res, songs, total, page, limit);
});

export const getSongById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const song = await prisma.song.findUnique({
    where: { id },
    include: {
      artist: {
        select: {
          id: true,
          name: true,
          slug: true,
          avatar: true,
          verified: true,
          _count: {
            select: {
              songs: true,
            },
          },
        },
      },
      album: {
        select: {
          id: true,
          title: true,
          slug: true,
          coverImage: true,
        },
      },
      genre: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  if (!song) {
    throw new AppError("Song not found", 404);
  }

  sendSuccess(res, song);
});

export const createSong = asyncHandler(async (req: Request, res: Response) => {
  const { title, duration, audioUrl, coverImage, lyrics, trackNumber, isExplicit, artistId, albumId, genreId } = req.body;

  if (!title || !artistId) {
    throw new AppError("Title and artistId are required", 400);
  }

  const slug = `${createSlug(title)}-${Date.now()}`;

  const song = await prisma.song.create({
    data: {
      title,
      slug,
      duration: duration ?? 0,
      audioUrl,
      coverImage,
      lyrics,
      trackNumber,
      isExplicit: isExplicit ?? false,
      artistId,
      albumId: albumId || null,
      genreId: genreId || null,
    },
    include: SONG_INCLUDE,
  });

  sendSuccess(res, song, 201);
});

export const updateSong = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { title, duration, audioUrl, coverImage, lyrics, trackNumber, isExplicit, artistId, albumId, genreId } = req.body;

  const existing = await prisma.song.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError("Song not found", 404);
  }

  const song = await prisma.song.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(duration !== undefined && { duration }),
      ...(audioUrl !== undefined && { audioUrl }),
      ...(coverImage !== undefined && { coverImage }),
      ...(lyrics !== undefined && { lyrics }),
      ...(trackNumber !== undefined && { trackNumber }),
      ...(isExplicit !== undefined && { isExplicit }),
      ...(artistId !== undefined && { artistId }),
      ...(albumId !== undefined && { albumId: albumId || null }),
      ...(genreId !== undefined && { genreId: genreId || null }),
    },
    include: SONG_INCLUDE,
  });

  sendSuccess(res, song);
});

export const deleteSong = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const existing = await prisma.song.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError("Song not found", 404);
  }

  await prisma.song.delete({ where: { id } });

  sendSuccess(res, { message: "Song deleted successfully" });
});

export const incrementPlayCount = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;

  const song = await prisma.song.findUnique({ where: { id } });

  if (!song) {
    throw new AppError("Song not found", 404);
  }

  await prisma.song.update({
    where: { id },
    data: { playCount: { increment: 1 } },
  });

  if (req.user?.id) {
    await prisma.history.create({
      data: {
        userId: req.user.id,
        songId: id,
        action: "PLAY",
      },
    });
  }

  sendSuccess(res, { message: "Play count incremented" });
});

export const getTrendingSongs = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 20;
  const songs = await prisma.song.findMany({
    include: SONG_INCLUDE,
    orderBy: { playCount: "desc" },
    take: limit,
  });

  sendSuccess(res, songs);
});

export const getNewReleases = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 20;
  const songs = await prisma.song.findMany({
    include: SONG_INCLUDE,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  sendSuccess(res, songs);
});

export const getRecommendedSongs = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user?.id) {
    const trending = await prisma.song.findMany({
      include: SONG_INCLUDE,
      orderBy: { playCount: "desc" },
      take: 30,
    });

    sendSuccess(res, trending);
    return;
  }

  const recentHistory = await prisma.history.findMany({
    where: { userId: req.user.id },
    include: {
      song: {
        select: {
          genreId: true,
          artistId: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const genreIds = [...new Set(recentHistory.map((h) => h.song.genreId).filter(Boolean))] as string[];
  const artistIds = [...new Set(recentHistory.map((h) => h.song.artistId).filter(Boolean))] as string[];
  const playedSongIds = recentHistory.map((h) => h.songId);

  const recommendations = await prisma.song.findMany({
    where: {
      AND: [
        { id: { notIn: playedSongIds } },
        {
          OR: [
            ...(genreIds.length > 0 ? [{ genreId: { in: genreIds } }] : []),
            ...(artistIds.length > 0 ? [{ artistId: { in: artistIds } }] : []),
          ],
        },
      ],
    },
    include: SONG_INCLUDE,
    orderBy: { playCount: "desc" },
    take: 30,
  });

  if (recommendations.length < 30) {
    const remaining = 30 - recommendations.length;
    const recommendationIds = recommendations.map((s) => s.id);

    const trending = await prisma.song.findMany({
      where: {
        id: { notIn: [...playedSongIds, ...recommendationIds] },
      },
      include: SONG_INCLUDE,
      orderBy: { playCount: "desc" },
      take: remaining,
    });

    recommendations.push(...trending);
  }

  sendSuccess(res, recommendations);
});
