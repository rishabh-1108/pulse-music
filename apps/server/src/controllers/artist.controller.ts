import { Request, Response } from "express";
import prisma from "../config/database";
import { AuthRequest, PaginationQuery } from "../types";
import { AppError, asyncHandler } from "../utils/errors";
import { sendSuccess, sendPaginatedResponse } from "../utils/response";
import { getPaginationParams, createSlug } from "../utils/helpers";

export const getArtists = asyncHandler(async (req: Request, res: Response) => {
  const { search } = req.query as Record<string, string | undefined>;
  const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(req.query as PaginationQuery);

  const where: Record<string, any> = {};

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  const [artists, total] = await Promise.all([
    prisma.artist.findMany({
      where,
      include: {
        user: {
          select: {
            avatar: true,
            _count: {
              select: {
                followers: true,
              },
            },
          },
        },
        _count: {
          select: {
            songs: true,
            albums: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.artist.count({ where }),
  ]);

  sendPaginatedResponse(res, artists, total, page, limit);
});

export const getArtistById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const artist = await prisma.artist.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          avatar: true,
          _count: {
            select: {
              followers: true,
            },
          },
        },
      },
      genres: {
        include: {
          genre: true,
        },
      },
      _count: {
        select: {
          songs: true,
          albums: true,
        },
      },
    },
  });

  if (!artist) {
    throw new AppError("Artist not found", 404);
  }

  sendSuccess(res, artist);
});

export const getArtistBySlug = asyncHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;

  const artist = await prisma.artist.findUnique({
    where: { slug },
    include: {
      user: {
        select: {
          avatar: true,
          _count: {
            select: {
              followers: true,
            },
          },
        },
      },
      genres: {
        include: {
          genre: true,
        },
      },
      albums: {
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              songs: true,
            },
          },
        },
      },
      songs: {
        take: 10,
        orderBy: { playCount: "desc" },
        include: {
          album: {
            select: {
              id: true,
              title: true,
              slug: true,
              coverImage: true,
            },
          },
          _count: {
            select: {
              likes: true,
            },
          },
        },
      },
      _count: {
        select: {
          songs: true,
          albums: true,
        },
      },
    },
  });

  if (!artist) {
    throw new AppError("Artist not found", 404);
  }

  sendSuccess(res, artist);
});

export const createArtist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userId, name, bio, avatar, coverImage, socialLinks } = req.body;

  if (!userId || !name) {
    throw new AppError("userId and name are required", 400);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const existingArtist = await prisma.artist.findUnique({
    where: { userId },
  });

  if (existingArtist) {
    throw new AppError("This user is already an artist", 409);
  }

  const slug = createSlug(name);

  const slugExists = await prisma.artist.findUnique({ where: { slug } });

  if (slugExists) {
    throw new AppError("An artist with this name already exists", 409);
  }

  const [artist] = await prisma.$transaction([
    prisma.artist.create({
      data: {
        userId,
        name,
        slug,
        bio: bio || null,
        avatar: avatar || null,
        coverImage: coverImage || null,
        socialLinks: socialLinks || null,
      },
      include: {
        user: {
          select: {
            avatar: true,
          },
        },
        _count: {
          select: {
            songs: true,
            albums: true,
          },
        },
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { role: "ARTIST" },
    }),
  ]);

  sendSuccess(res, artist, 201);
});

export const updateArtist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { name, bio, avatar, coverImage, verified, monthlyListeners, socialLinks } = req.body;

  const existingArtist = await prisma.artist.findUnique({ where: { id } });

  if (!existingArtist) {
    throw new AppError("Artist not found", 404);
  }

  const data: Record<string, any> = {};

  if (name !== undefined) {
    data.name = name;
    data.slug = createSlug(name);
  }

  if (bio !== undefined) {
    data.bio = bio;
  }

  if (avatar !== undefined) {
    data.avatar = avatar;
  }

  if (coverImage !== undefined) {
    data.coverImage = coverImage;
  }

  if (verified !== undefined) {
    data.verified = verified;
  }

  if (monthlyListeners !== undefined) {
    data.monthlyListeners = monthlyListeners;
  }

  if (socialLinks !== undefined) {
    data.socialLinks = socialLinks;
  }

  const artist = await prisma.artist.update({
    where: { id },
    data,
    include: {
      user: {
        select: {
          avatar: true,
        },
      },
      genres: {
        include: {
          genre: true,
        },
      },
      _count: {
        select: {
          songs: true,
          albums: true,
        },
      },
    },
  });

  sendSuccess(res, artist);
});

export const followArtist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;

  if (!req.user?.id) {
    throw new AppError("Authentication required", 401);
  }

  const artist = await prisma.artist.findUnique({ where: { id } });

  if (!artist) {
    throw new AppError("Artist not found", 404);
  }

  if (artist.userId === req.user.id) {
    throw new AppError("You cannot follow yourself", 400);
  }

  const existingFollow = await prisma.follower.findUnique({
    where: {
      followerId_followingId: {
        followerId: req.user.id,
        followingId: artist.userId,
      },
    },
  });

  if (existingFollow) {
    await prisma.follower.delete({
      where: { id: existingFollow.id },
    });
    sendSuccess(res, { followed: false });
  } else {
    await prisma.follower.create({
      data: {
        followerId: req.user.id,
        followingId: artist.userId,
      },
    });
    sendSuccess(res, { followed: true });
  }
});

export const checkArtistFollow = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;

  const artist = await prisma.artist.findUnique({ where: { id } });
  if (!artist) throw new AppError("Artist not found", 404);

  if (!req.user?.id) {
    sendSuccess(res, { isFollowing: false });
    return;
  }

  const follow = await prisma.follower.findUnique({
    where: {
      followerId_followingId: {
        followerId: req.user.id,
        followingId: artist.userId,
      },
    },
  });

  sendSuccess(res, { isFollowing: !!follow });
});
