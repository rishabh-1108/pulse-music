import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { errorHandler } from './utils/errors';

import authRoutes from './routes/auth.routes';
import songRoutes from './routes/song.routes';
import albumRoutes from './routes/album.routes';
import artistRoutes from './routes/artist.routes';
import playlistRoutes from './routes/playlist.routes';
import searchRoutes from './routes/search.routes';
import userRoutes from './routes/user.routes';
import genreRoutes from './routes/genre.routes';
import notificationRoutes from './routes/notification.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many authentication attempts' },
});
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/songs', songRoutes);
app.use('/api/v1/albums', albumRoutes);
app.use('/api/v1/artists', artistRoutes);
app.use('/api/v1/playlists', playlistRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/genres', genreRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use('*', (_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Pulse Music API running on port ${config.port}`);
});

export default app;
