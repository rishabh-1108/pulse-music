import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/database";
import { AuthRequest, PaginationQuery } from "../types";
import { AppError, asyncHandler } from "../utils/errors";
import { sendSuccess, sendPaginatedResponse } from "../utils/response";
import { getPaginationParams } from "../utils/helpers";

export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const username = req.params.username as string;

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatar: true,
      bio: true,
      isVerified: true,
      createdAt: true,
      _count: {
        select: {
          followers: true,
          following: true,
          playlists: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  sendSuccess(res, user);
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { displayName, bio, avatar } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      ...(displayName !== undefined && { displayName }),
      ...(bio !== undefined && { bio }),
      ...(avatar !== undefined && { avatar }),
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatar: true,
      bio: true,
      isVerified: true,
      createdAt: true,
    },
  });

  sendSuccess(res, updatedUser);
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { password: true },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.password) {
    throw new AppError("No password set for this account", 400);
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    throw new AppError("Current password is incorrect", 401);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: req.user!.id },
    data: { password: hashedPassword },
  });

  sendSuccess(res, { message: "Password updated successfully" });
});

export const followUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.params.userId as string;

  if (userId === req.user!.id) {
    throw new AppError("You cannot follow yourself", 400);
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!targetUser) {
    throw new AppError("User not found", 404);
  }

  const existingFollow = await prisma.follower.findUnique({
    where: {
      followerId_followingId: {
        followerId: req.user!.id,
        followingId: userId,
      },
    },
  });

  if (existingFollow) {
    await prisma.follower.delete({
      where: {
        followerId_followingId: {
          followerId: req.user!.id,
          followingId: userId,
        },
      },
    });

    sendSuccess(res, { followed: false });
  } else {
    await prisma.follower.create({
      data: {
        followerId: req.user!.id,
        followingId: userId,
      },
    });

    await prisma.notification.create({
      data: {
        userId,
        type: "FOLLOW",
        title: "New Follower",
        message: `You have a new follower`,
      },
    });

    sendSuccess(res, { followed: true }, 201);
  }
});

export const getFollowers = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const { page, limit, skip } = getPaginationParams(req.query as PaginationQuery);

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const [followers, total] = await Promise.all([
    prisma.follower.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            isVerified: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.follower.count({ where: { followingId: userId } }),
  ]);

  const followerList = followers.map((follow) => follow.follower);

  sendPaginatedResponse(res, followerList, total, page, limit);
});

export const getFollowing = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const { page, limit, skip } = getPaginationParams(req.query as PaginationQuery);

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const [following, total] = await Promise.all([
    prisma.follower.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            isVerified: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.follower.count({ where: { followerId: userId } }),
  ]);

  const followingList = following.map((follow) => follow.following);

  sendPaginatedResponse(res, followingList, total, page, limit);
});

export const likeSong = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { songId } = req.body;

  const song = await prisma.song.findUnique({ where: { id: songId } });

  if (!song) {
    throw new AppError("Song not found", 404);
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_songId: {
        userId: req.user!.id,
        songId,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        userId_songId: {
          userId: req.user!.id,
          songId,
        },
      },
    });

    sendSuccess(res, { liked: false });
  } else {
    await prisma.like.create({
      data: {
        userId: req.user!.id,
        songId,
      },
    });

    sendSuccess(res, { liked: true }, 201);
  }
});

export const likeAlbum = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { albumId } = req.body;

  const album = await prisma.album.findUnique({ where: { id: albumId } });

  if (!album) {
    throw new AppError("Album not found", 404);
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_albumId: {
        userId: req.user!.id,
        albumId,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        userId_albumId: {
          userId: req.user!.id,
          albumId,
        },
      },
    });

    sendSuccess(res, { liked: false });
  } else {
    await prisma.like.create({
      data: {
        userId: req.user!.id,
        albumId,
      },
    });

    sendSuccess(res, { liked: true }, 201);
  }
});

export const getLikedSongs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query as PaginationQuery);

  const [likes, total] = await Promise.all([
    prisma.like.findMany({
      where: { userId: req.user!.id, songId: { not: null } },
      include: {
        song: {
          include: {
            artist: true,
            _count: {
              select: { likes: true },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.like.count({ where: { userId: req.user!.id, songId: { not: null } } }),
  ]);

  const songs = likes.map((like) => like.song).filter(Boolean);

  sendPaginatedResponse(res, songs as any, total, page, limit);
});

export const getLikedAlbums = asyncHandler(async (req: AuthRequest, res: Response) => {
  const likes = await prisma.like.findMany({
    where: { userId: req.user!.id, albumId: { not: null } },
    include: {
      album: {
        include: {
          artist: true,
          _count: {
            select: { songs: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const albums = likes.map((like) => like.album).filter(Boolean);

  sendSuccess(res, albums);
});

export const getHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query as PaginationQuery);

  const [history, total] = await Promise.all([
    prisma.history.findMany({
      where: { userId: req.user!.id },
      include: {
        song: {
          include: {
            artist: true,
            _count: {
              select: { likes: true },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.history.count({ where: { userId: req.user!.id } }),
  ]);

  const mappedHistory = history.map((entry) => ({
    ...entry.song,
    playedAt: entry.createdAt,
  }));

  sendPaginatedResponse(res, mappedHistory, total, page, limit);
});

export const deleteAccount = asyncHandler(async (req: AuthRequest, res: Response) => {
  await prisma.user.delete({
    where: { id: req.user!.id },
  });

  sendSuccess(res, { message: "Account deleted successfully" });
});
