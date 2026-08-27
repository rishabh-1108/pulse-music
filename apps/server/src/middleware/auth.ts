import { Request, Response, NextFunction } from 'express';
import { AuthRequest, JwtPayload } from '../types';
import { verifyAccessToken } from '../utils/tokens';
import { AppError } from '../utils/errors';
import prisma from '../config/database';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required', 401);
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, username: true, role: true },
    });
    if (!user) throw new AppError('User not found', 401);

    (req as AuthRequest).user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) return next(error);
    next(new AppError('Invalid or expired token', 401));
  }
};

export const optionalAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return next();

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, username: true, role: true },
    });
    if (user) (req as AuthRequest).user = user;
    next();
  } catch {
    next();
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    if (!authReq.user) return next(new AppError('Authentication required', 401));
    if (!roles.includes(authReq.user.role)) return next(new AppError('Insufficient permissions', 403));
    next();
  };
};
