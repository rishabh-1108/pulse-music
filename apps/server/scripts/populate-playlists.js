const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const playlists = await prisma.playlist.findMany({ select: { id: true, name: true } });
  const songs = await prisma.song.findMany({ select: { id: true } });

  console.log(`${playlists.length} playlists, ${songs.length} songs`);

  const shuffled = [...songs].sort(() => Math.random() - 0.5);
  const perPlaylist = Math.ceil(songs.length / playlists.length);

  for (let i = 0; i < playlists.length; i++) {
    const start = i * perPlaylist;
    const chunk = shuffled.slice(start, start + perPlaylist);
    if (chunk.length === 0) continue;

    await prisma.playlistSong.createMany({
      data: chunk.map((s, idx) => ({
        playlistId: playlists[i].id,
        songId: s.id,
        position: idx + 1,
      })),
    });
    console.log(`${playlists[i].name}: ${chunk.length} songs`);
  }

  console.log('Done!');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
