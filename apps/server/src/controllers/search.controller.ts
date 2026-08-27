import { Request, Response } from "express";
import prisma from "../config/database";
import { asyncHandler } from "../utils/errors";
import { sendSuccess } from "../utils/response";

export const search = asyncHandler(async (req: Request, res: Response) => {
  const { q, type } = req.query;
  const query = (q as string) || "";
  const types = type
    ? (type as string).split(",").map((t) => t.trim())
    : ["songs", "albums", "artists", "playlists", "genres"];

  if (!query) {
    return sendSuccess(res, {
      songs: [],
      albums: [],
      artists: [],
      playlists: [],
      genres: [],
    });
  }

  const results: Record<string, unknown[]> = {};

  const promises: Promise<void>[] = [];

  if (types.includes("songs")) {
    promises.push(
      prisma.song
        .findMany({
          where: {
            title: { contains: query, mode: "insensitive" },
          },
          take: 10,
          include: {
            artist: true,
            album: true,
            _count: { select: { likes: true } },
          },
          orderBy: { playCount: "desc" },
        })
        .then((songs) => {
          results.songs = songs;
        })
    );
  }

  if (types.includes("albums")) {
    promises.push(
      prisma.album
        .findMany({
          where: {
            title: { contains: query, mode: "insensitive" },
          },
          take: 10,
          include: {
            artist: true,
            _count: { select: { songs: true } },
          },
          orderBy: { releaseDate: "desc" },
        })
        .then((albums) => {
          results.albums = albums;
        })
    );
  }

  if (types.includes("artists")) {
    promises.push(
      prisma.artist
        .findMany({
          where: {
            name: { contains: query, mode: "insensitive" },
          },
          take: 10,
          include: {
            user: { select: { avatar: true } },
            _count: { select: { songs: true } },
          },
          orderBy: { monthlyListeners: "desc" },
        })
        .then((artists) => {
          results.artists = artists;
        })
    );
  }

  if (types.includes("playlists")) {
    promises.push(
      prisma.playlist
        .findMany({
          where: {
            isPublic: true,
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
          take: 10,
          include: {
            user: { select: { id: true, displayName: true, username: true, avatar: true } },
            _count: { select: { songs: true } },
          },
        })
        .then((playlists) => {
          results.playlists = playlists;
        })
    );
  }

  if (types.includes("genres")) {
    promises.push(
      prisma.genre
        .findMany({
          where: {
            name: { contains: query, mode: "insensitive" },
          },
          take: 10,
        })
        .then((genres) => {
          results.genres = genres;
        })
    );
  }

  await Promise.all(promises);

  return sendSuccess(res, results);
});

export const getSearchSuggestions = asyncHandler(
  async (req: Request, res: Response) => {
    const { q } = req.query;
    const query = (q as string) || "";

    if (query.length < 2) {
      return sendSuccess(res, []);
    }

    const [songs, artists, albums] = await Promise.all([
      prisma.song.findMany({
        where: {
          title: { contains: query, mode: "insensitive" },
        },
        take: 5,
        select: { title: true, coverImage: true },
      }),
      prisma.artist.findMany({
        where: {
          name: { contains: query, mode: "insensitive" },
        },
        take: 5,
        select: { name: true, user: { select: { avatar: true } } },
      }),
      prisma.album.findMany({
        where: {
          title: { contains: query, mode: "insensitive" },
        },
        take: 5,
        select: { title: true, coverImage: true },
      }),
    ]);

    const suggestions = [
      ...songs.map((s) => ({
        type: "song" as const,
        title: s.title,
        coverImage: s.coverImage,
      })),
      ...artists.map((a) => ({
        type: "artist" as const,
        name: a.name,
        avatar: a.user.avatar,
      })),
      ...albums.map((a) => ({
        type: "album" as const,
        title: a.title,
        coverImage: a.coverImage,
      })),
    ].slice(0, 10);

    return sendSuccess(res, suggestions);
  }
);

export const getBrowseCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    const genres = await prisma.genre.findMany({
      orderBy: { name: "asc" },
    });

    return sendSuccess(res, genres);
  }
);
