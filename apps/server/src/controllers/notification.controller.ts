import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/errors';
import { sendSuccess, sendPaginatedResponse } from '../utils/response';
import { getPaginationParams } from '../utils/helpers';

export const getNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query as any);

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.notification.count({ where: { userId: req.user!.id } }),
  ]);

  const unreadCount = await prisma.notification.count({
    where: { userId: req.user!.id, read: false },
  });

  sendSuccess(res, { notifications, unreadCount, pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: page < Math.ceil(total / limit), hasPrev: page > 1 } });
});

export const markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  await prisma.notification.update({ where: { id }, data: { read: true } });
  sendSuccess(res, { message: 'Notification marked as read' });
});

export const markAllAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  await prisma.notification.updateMany({
    where: { userId: req.user!.id, read: false },
    data: { read: true },
  });
  sendSuccess(res, { message: 'All notifications marked as read' });
});

export const deleteNotification = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  await prisma.notification.delete({ where: { id } });
  sendSuccess(res, { message: 'Notification deleted' });
});
