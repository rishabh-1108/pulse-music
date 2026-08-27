import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const genres = [
  { name: 'Pop', slug: 'pop', color: '#f472b6' },
  { name: 'Rock', slug: 'rock', color: '#ef4444' },
  { name: 'Hip Hop', slug: 'hip-hop', color: '#f59e0b' },
  { name: 'R&B', slug: 'r-and-b', color: '#8b5cf6' },
  { name: 'Jazz', slug: 'jazz', color: '#06b6d4' },
  { name: 'Classical', slug: 'classical', color: '#6366f1' },
  { name: 'Electronic', slug: 'electronic', color: '#10b981' },
  { name: 'Country', slug: 'country', color: '#d97706' },
  { name: 'Folk', slug: 'folk', color: '#78716c' },
  { name: 'Reggae', slug: 'reggae', color: '#22c55e' },
  { name: 'Blues', slug: 'blues', color: '#3b82f6' },
  { name: 'Metal', slug: 'metal', color: '#1f2937' },
  { name: 'Indie', slug: 'indie', color: '#a855f7' },
  { name: 'Latin', slug: 'latin', color: '#f97316' },
  { name: 'Ambient', slug: 'ambient', color: '#64748b' },
];

const artistsData = [
  { name: 'Aurora Nights', slug: 'aurora-nights', verified: true },
  { name: 'The Velvet Echo', slug: 'the-velvet-echo', verified: true },
  { name: 'Neon Cascade', slug: 'neon-cascade', verified: true },
  { name: 'Midnight Rivers', slug: 'midnight-rivers', verified: true },
  { name: 'Solar Winds', slug: 'solar-winds', verified: true },
  { name: 'Crystal Horizon', slug: 'crystal-horizon', verified: true },
  { name: 'Ember Skies', slug: 'ember-skies', verified: true },
  { name: 'Velvet Storm', slug: 'velvet-storm', verified: false },
  { name: 'Lunar Drift', slug: 'lunar-drift', verified: true },
  { name: 'Glass Ocean', slug: 'glass-ocean', verified: false },
  { name: 'Iron Lotus', slug: 'iron-lotus', verified: true },
  { name: 'Paper Moths', slug: 'paper-moths', verified: false },
];

const albumsData: Record<string, { title: string; year: number; songs: string[] }> = {
  'aurora-nights': { title: 'Stardust Memories', year: 2024, songs: ['Cosmic Lullaby', 'Nebula Dreams', 'Starlight Sonata', 'Aurora Borealis', 'Galaxy Waltz', 'Orbiting Shadows', 'Supernova', 'Celestial Tide', 'Moonlit Path', 'Infinity Loop'] },
  'the-velvet-echo': { title: 'Whispered Horizons', year: 2024, songs: ['Silent Waves', 'Phantom Signal', 'Echoes in Fog', 'Velvet Twilight', 'Distant Thunder', 'Hollow Light', 'Shattered Glass', 'Ghost Frequency'] },
  'neon-cascade': { title: 'Digital Rivers', year: 2023, songs: ['Pixel Rain', 'Binary Sunset', 'Circuit Bloom', 'Neon Cascade', 'Data Stream', 'Voltage', 'Synthetic Dawn', 'Laser Haze', 'Code Breaker', 'Electric Pulse'] },
  'midnight-rivers': { title: 'Nocturnal Tides', year: 2024, songs: ['Midnight Crossing', 'River Song', 'Dark Water', 'Starless Night', 'Undertow', 'Tidal Moon', 'Black Current'] },
  'solar-winds': { title: 'Heliosphere', year: 2023, songs: ['Solar Flare', 'Wind Rider', 'Photon Dance', 'Sunspot', 'Corona', 'Plasma Storm', 'Magnetic Field', 'Helium Sky'] },
  'crystal-horizon': { title: 'Prismatic Light', year: 2024, songs: ['Crystal Clear', 'Horizon Line', 'Refracted', 'Spectrum', 'Kaleidoscope', 'Iridescent', 'Prism Break', 'Light Bender', 'Color Theory'] },
  'ember-skies': { title: 'Burning Dawn', year: 2023, songs: ['Ember Glow', 'Ash Cloud', 'Smoke Signal', 'Wildfire', 'Scorched Earth', 'Phoenix Rise', 'Cinder Song'] },
  'velvet-storm': { title: 'Thunder & Silk', year: 2024, songs: ['Velvet Rain', 'Storm Chaser', 'Silk Thunder', 'Tempest Heart', 'Lightning Kiss', 'Eye of Storm'] },
  'lunar-drift': { title: 'Tidal Lock', year: 2024, songs: ['Lunar Phase', 'Dark Side', 'Crescent Moon', 'Gravity Pull', 'Moonstone', 'Eclipse', 'Farside', 'New Moon', 'Waning Light'] },
  'glass-ocean': { title: 'Translucent', year: 2023, songs: ['Glass Waves', 'Clear Water', 'Reflection Pool', 'Frozen Lake', 'Ice Crystal', 'Transparent'] },
  'iron-lotus': { title: 'Steel & Petals', year: 2024, songs: ['Iron Bloom', 'Metal Garden', 'Lotus Engine', 'Rust & Rose', 'Forged Flower', 'Alloy Dream', 'Steel Meditation'] },
  'paper-moths': { title: 'Origami Wings', year: 2023, songs: ['Paper Wings', 'Folded Light', 'Moth to Flame', 'Delicate', 'Tissue Ghost', 'Fragile Flight'] },
};

const playlistNames = [
  'Chill Vibes', 'Workout Energy', 'Late Night Drives', 'Focus Flow', 'Morning Coffee',
  'Party Anthems', 'Acoustic Sessions', 'Road Trip Mix', 'Study Beats', 'Weekend Mood',
  'Deep Thoughts', 'Sunset Chill', 'Electronic Dreams', 'Indie Favorites', 'Rock Classics',
];

function randomDuration() { return 180 + Math.floor(Math.random() * 120); }

async function main() {
  console.log('Seeding database...');

  // Create default accounts
  const password = await bcrypt.hash('Password123', 12);
  const admin = await prisma.user.upsert({ where: { email: 'admin@pulse.music' }, update: {}, create: { email: 'admin@pulse.music', username: 'admin', displayName: 'Admin User', password, role: 'ADMIN', isEmailVerified: true } });
  const user = await prisma.user.upsert({ where: { email: 'user@pulse.music' }, update: {}, create: { email: 'user@pulse.music', username: 'listener', displayName: 'Regular User', password, role: 'USER', isEmailVerified: true } });
  const artistUser = await prisma.user.upsert({ where: { email: 'artist@pulse.music' }, update: {}, create: { email: 'artist@pulse.music', username: 'artist', displayName: 'Demo Artist', password, role: 'ARTIST', isEmailVerified: true } });
  console.log('Default accounts created.');

  // Create genres
  const genreRecords: Record<string, any> = {};
  for (const g of genres) {
    genreRecords[g.slug] = await prisma.genre.upsert({ where: { slug: g.slug }, update: {}, create: g });
  }
  console.log(`${genres.length} genres created.`);

  // Create artists and albums
  let totalSongs = 0;
  const allArtistRecords: any[] = [];

  for (const ad of artistsData) {
    const artistUserAccount = await prisma.user.upsert({
      where: { username: ad.slug },
      update: {},
      create: {
        email: `${ad.slug}@pulse.music`,
        username: ad.slug,
        displayName: ad.name,
        password,
        role: 'ARTIST',
        isEmailVerified: true,
      },
    });

    const artist = await prisma.artist.upsert({
      where: { slug: ad.slug },
      update: {},
      create: { name: ad.name, slug: ad.slug, verified: ad.verified, userId: artistUserAccount.id },
    });
    allArtistRecords.push(artist);

    const albumInfo = albumsData[ad.slug];
    if (!albumInfo) continue;

    const album = await prisma.album.upsert({
      where: { id: `${ad.slug}-album` },
      update: {},
      create: {
        id: `${ad.slug}-album`,
        title: albumInfo.title,
        slug: `${ad.slug}-${albumInfo.title.toLowerCase().replace(/\s+/g, '-')}`,
        artistId: artist.id,
        releaseDate: new Date(`${albumInfo.year}-01-01`),
        coverImage: `/placeholder-album.svg`,
      },
    });

    // Assign 1-2 genres per artist
    const genreKeys = Object.keys(genreRecords);
    const artistGenres = [genreKeys[Math.floor(Math.random() * genreKeys.length)], genreKeys[Math.floor(Math.random() * genreKeys.length)]];
    for (const gs of [...new Set(artistGenres)]) {
      try {
        await prisma.artistGenre.upsert({ where: { artistId_genreId: { artistId: artist.id, genreId: genreRecords[gs].id } }, update: {}, create: { artistId: artist.id, genreId: genreRecords[gs].id } });
      } catch {}
    }

    for (const [i, songTitle] of albumInfo.songs.entries()) {
      const songId = `${ad.slug}-song-${i}`;
      const song = await prisma.song.upsert({
        where: { id: songId },
        update: {},
        create: {
          id: songId,
          title: songTitle,
          slug: `${ad.slug}-${songTitle.toLowerCase().replace(/\s+/g, '-')}`,
          duration: randomDuration(),
          artistId: artist.id,
          albumId: album.id,
          genreId: genreRecords[artistGenres[0]].id,
          coverImage: '/placeholder-album.svg',
          audioUrl: '',
          isExplicit: Math.random() > 0.8,
          playCount: Math.floor(Math.random() * 50000),
        },
      });
      totalSongs++;
    }
  }
  console.log(`${allArtistRecords.length} artists, ${totalSongs} songs created.`);

  // Create some playlists
  const playlistUsers = [admin, user];
  const songs = await prisma.song.findMany({ take: 50 });

  for (let i = 0; i < 15; i++) {
    const plUser = playlistUsers[i % playlistUsers.length];
    const playlist = await prisma.playlist.create({
      data: {
        name: playlistNames[i],
        description: `A curated collection of tracks.`,
        isPublic: true,
        userId: plUser.id,
      },
    });

    const numSongs = 5 + Math.floor(Math.random() * 8);
    const shuffled = [...songs].sort(() => Math.random() - 0.5).slice(0, numSongs);
    for (let j = 0; j < shuffled.length; j++) {
      await prisma.playlistSong.create({
        data: { playlistId: playlist.id, songId: shuffled[j].id, position: j },
      });
    }
  }
  console.log('15 playlists created.');

  // Create some likes
  const userSongs = songs.slice(0, 20);
  for (const s of userSongs) {
    try { await prisma.like.upsert({ where: { userId_songId: { userId: user.id, songId: s.id } }, update: {}, create: { userId: user.id, songId: s.id } }); } catch {}
  }
  console.log('20 likes created.');

  // Create user follows (user follows admin)
  try { await prisma.follower.upsert({ where: { followerId_followingId: { followerId: user.id, followingId: admin.id } }, update: {}, create: { followerId: user.id, followingId: admin.id } }); } catch {}
  console.log('User follows created.');

  // Create some history
  for (const s of songs.slice(0, 10)) {
    await prisma.history.create({ data: { userId: user.id, songId: s.id } });
  }
  console.log('10 history entries created.');

  console.log('Seed complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
