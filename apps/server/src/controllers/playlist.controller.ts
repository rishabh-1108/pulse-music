import { Request, Response } from "express";
import prisma from "../config/database";
import { AuthRequest, PaginationQuery } from "../types";
import { AppError, asyncHandler } from "../utils/errors";
import { sendSuccess, sendPaginatedResponse } from "../utils/response";
import { getPaginationParams } from "../utils/helpers";

export const getUserPlaylists = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const playlists = await prisma.playlist.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { songs: true } },
      songs: {
        take: 4,
        orderBy: { position: "asc" },
        include: {
          song: {
            select: {
              id: true,
              title: true,
              coverImage: true,
              audioUrl: true,
            },
          },
        },
      },
    },
  });

  sendSuccess(res, playlists);
});

export const getPublicPlaylists = asyncHandler(async (req: Request, res: Response) => {
  const { search } = req.query;
  const { page, limit, skip } = getPaginationParams(req.query as PaginationQuery);

  const where: Record<string, any> = { isPublic: true };

  if (search) {
    where.OR = [
      { name: { contains: String(search), mode: "insensitive" } },
      { description: { contains: String(search), mode: "insensitive" } },
    ];
  }

  const [playlists, total] = await Promise.all([
    prisma.playlist.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
        _count: { select: { songs: true } },
        songs: {
          take: 4,
          orderBy: { position: "asc" },
          include: {
            song: {
              select: {
                id: true,
                title: true,
                coverImage: true,
                audioUrl: true,
              },
            },
          },
        },
      },
    }),
    prisma.playlist.count({ where }),
  ]);

  sendPaginatedResponse(res, playlists, total, page, limit);
});

export const getPlaylistById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user?.id;

  const playlist = await prisma.playlist.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, username: true, displayName: true, avatar: true },
      },
      songs: {
        orderBy: { position: "asc" },
        include: {
          song: {
            include: {
              artist: { select: { id: true, name: true, avatar: true } },
              album: { select: { id: true, title: true, coverImage: true } },
              _count: { select: { likes: true } },
            },
          },
        },
      },
      _count: { select: { songs: true } },
    },
  });

  if (!playlist) {
    throw new AppError("Playlist not found", 404);
  }

  if (!playlist.isPublic && playlist.userId !== userId) {
    throw new AppError("Access denied", 403);
  }

  sendSuccess(res, playlist);
});

export const createPlaylist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { name, description, isPublic, coverImage } = req.body;

  if (!name) {
    throw new AppError("Playlist name is required", 400);
  }

  const playlist = await prisma.playlist.create({
    data: {
      userId,
      name,
      description: description || null,
      isPublic: isPublic ?? true,
      coverImage: coverImage || null,
    },
    include: {
      _count: { select: { songs: true } },
    },
  });

  sendSuccess(res, playlist, 201);
});

export const updatePlaylist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user!.id;
  const { name, description, isPublic, coverImage } = req.body;

  const existing = await prisma.playlist.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError("Playlist not found", 404);
  }

  if (existing.userId !== userId) {
    throw new AppError("Access denied", 403);
  }

  const playlist = await prisma.playlist.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(isPublic !== undefined && { isPublic }),
      ...(coverImage !== undefined && { coverImage }),
    },
    include: {
      _count: { select: { songs: true } },
    },
  });

  sendSuccess(res, playlist);
});

export const deletePlaylist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user!.id;

  const existing = await prisma.playlist.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError("Playlist not found", 404);
  }

  if (existing.userId !== userId) {
    throw new AppError("Access denied", 403);
  }

  await prisma.playlist.delete({ where: { id } });

  sendSuccess(res, { message: "Playlist deleted successfully" });
});

export const addSongToPlaylist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { songId } = req.body;
  const userId = req.user!.id;

  if (!songId) {
    throw new AppError("songId is required", 400);
  }

  const playlist = await prisma.playlist.findUnique({ where: { id } });

  if (!playlist) {
    throw new AppError("Playlist not found", 404);
  }

  if (playlist.userId !== userId) {
    throw new AppError("Access denied", 403);
  }

  const existingSong = await prisma.playlistSong.findUnique({
    where: {
      playlistId_songId: { playlistId: id, songId },
    },
  });

  if (existingSong) {
    throw new AppError("Song already in playlist", 409);
  }

  const maxPosition = await prisma.playlistSong.aggregate({
    where: { playlistId: id },
    _max: { position: true },
  });

  const nextPosition = (maxPosition._max.position ?? -1) + 1;

  const playlistSong = await prisma.playlistSong.create({
    data: {
      playlistId: id,
      songId,
      position: nextPosition,
    },
    include: {
      song: {
        select: { id: true, title: true, coverImage: true, audioUrl: true },
      },
    },
  });

  sendSuccess(res, playlistSong, 201);
});

export const removeSongFromPlaylist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const songId = req.params.songId as string;
  const userId = req.user!.id;

  const playlist = await prisma.playlist.findUnique({ where: { id } });

  if (!playlist) {
    throw new AppError("Playlist not found", 404);
  }

  if (playlist.userId !== userId) {
    throw new AppError("Access denied", 403);
  }

  const playlistSong = await prisma.playlistSong.findUnique({
    where: {
      playlistId_songId: { playlistId: id, songId },
    },
  });

  if (!playlistSong) {
    throw new AppError("Song not found in playlist", 404);
  }

  await prisma.playlistSong.delete({
    where: {
      playlistId_songId: { playlistId: id, songId },
    },
  });

  sendSuccess(res, { message: "Song removed from playlist" });
});

export const reorderPlaylist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { songIds } = req.body;
  const userId = req.user!.id;

  if (!Array.isArray(songIds)) {
    throw new AppError("songIds must be an array", 400);
  }

  const playlist = await prisma.playlist.findUnique({ where: { id } });

  if (!playlist) {
    throw new AppError("Playlist not found", 404);
  }

  if (playlist.userId !== userId) {
    throw new AppError("Access denied", 403);
  }

  await prisma.$transaction(
    songIds.map((songId: string, index: number) =>
      prisma.playlistSong.update({
        where: {
          playlistId_songId: { playlistId: id, songId },
        },
        data: { position: index },
      })
    )
  );

  const updatedPlaylist = await prisma.playlist.findUnique({
    where: { id },
    include: {
      songs: {
        orderBy: { position: "asc" },
        include: {
          song: {
            select: { id: true, title: true, coverImage: true, audioUrl: true },
          },
        },
      },
      _count: { select: { songs: true } },
    },
  });

  sendSuccess(res, updatedPlaylist);
});
