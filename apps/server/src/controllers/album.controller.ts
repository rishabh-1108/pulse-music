import { Request, Response } from "express";
import prisma from "../config/database";
import { AuthRequest, PaginationQuery } from "../types";
import { AppError, asyncHandler } from "../utils/errors";
import { sendSuccess, sendPaginatedResponse } from "../utils/response";
import { getPaginationParams, createSlug } from "../utils/helpers";

export const getAlbums = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      page,
      limit,
      genre,
      artistId,
      search,
    } = req.query as PaginationQuery & {
      genre?: string;
      artistId?: string;
      search?: string;
    };

    const { page: currentPage, limit: perPage, skip } = getPaginationParams({
      page: String(page || '1'),
      limit: String(limit || '20'),
    });

    const where: any = {};

    if (genre) {
      where.genre = { name: { contains: genre, mode: "insensitive" } };
    }

    if (artistId) {
      where.artistId = artistId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { artist: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [albums, total] = await Promise.all([
      prisma.album.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { createdAt: "desc" },
        include: {
          artist: {
            select: {
              id: true,
              name: true,
              slug: true,
              avatar: true,
              verified: true,
            },
          },
          genre: true,
          _count: {
            select: {
              songs: true,
              likes: true,
            },
          },
        },
      }),
      prisma.album.count({ where }),
    ]);

    sendPaginatedResponse(res, albums, total, currentPage, perPage);
  }
);

export const getAlbumById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    let album = await prisma.album.findUnique({
      where: { id },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            slug: true,
            avatar: true,
            verified: true,
          },
        },
        genre: true,
        songs: {
          orderBy: { trackNumber: "asc" },
          include: {
            artist: {
              select: {
                id: true,
                name: true,
                slug: true,
                avatar: true,
                verified: true,
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
            likes: true,
          },
        },
      },
    });

    if (!album) {
      album = await prisma.album.findUnique({
        where: { slug: id },
        include: {
          artist: {
            select: {
              id: true,
              name: true,
              slug: true,
              avatar: true,
              verified: true,
            },
          },
          genre: true,
          songs: {
            orderBy: { trackNumber: "asc" },
            include: {
              artist: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  avatar: true,
                  verified: true,
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
              likes: true,
            },
          },
        },
      });
    }

    if (!album) {
      throw new AppError("Album not found", 404);
    }

    sendSuccess(res, album);
  }
);

export const createAlbum = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const {
      title,
      description,
      coverImage,
      releaseDate,
      artistId,
      genreId,
    } = req.body;

    if (!title || !artistId) {
      throw new AppError("Title and artistId are required", 400);
    }

    const slug = createSlug(title);

    const existingAlbum = await prisma.album.findUnique({
      where: { slug },
    });

    if (existingAlbum) {
      throw new AppError("An album with this title already exists", 409);
    }

    const album = await prisma.album.create({
      data: {
        title,
        slug,
        description: description || null,
        coverImage: coverImage || null,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        artistId,
        genreId: genreId || null,
      },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            slug: true,
            avatar: true,
            verified: true,
          },
        },
        genre: true,
        _count: {
          select: {
            songs: true,
            likes: true,
          },
        },
      },
    });

    sendSuccess(res, album, 201);
  }
);

export const updateAlbum = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const {
      title,
      description,
      coverImage,
      releaseDate,
      genreId,
    } = req.body;

    const existingAlbum = await prisma.album.findUnique({
      where: { id },
    });

    if (!existingAlbum) {
      throw new AppError("Album not found", 404);
    }

    const data: any = {};

    if (title !== undefined) {
      data.title = title;
      data.slug = createSlug(title);
    }

    if (description !== undefined) {
      data.description = description;
    }

    if (coverImage !== undefined) {
      data.coverImage = coverImage;
    }

    if (releaseDate !== undefined) {
      data.releaseDate = releaseDate ? new Date(releaseDate) : null;
    }

    if (genreId !== undefined) {
      data.genreId = genreId;
    }

    const album = await prisma.album.update({
      where: { id },
      data,
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            slug: true,
            avatar: true,
            verified: true,
          },
        },
        genre: true,
        _count: {
          select: {
            songs: true,
            likes: true,
          },
        },
      },
    });

    sendSuccess(res, album);
  }
);

export const deleteAlbum = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;

    const existingAlbum = await prisma.album.findUnique({
      where: { id },
    });

    if (!existingAlbum) {
      throw new AppError("Album not found", 404);
    }

    await prisma.album.delete({ where: { id } });

    sendSuccess(res, { message: "Album deleted successfully" });
  }
);
