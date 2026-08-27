import bcrypt from "bcryptjs";
import prisma from "../config/database";
import { AuthRequest } from "../types";
import { generateTokens, verifyRefreshToken } from "../utils/tokens";
import { AppError, asyncHandler } from "../utils/errors";
import { sendSuccess } from "../utils/response";
import { generateRandomString } from "../utils/helpers";
import { Request, Response } from "express";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, displayName, password } = req.body;

  if (!email || !username || !password) {
    throw new AppError("Email, username, and password are required", 400);
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    throw new AppError(
      existingUser.email === email
        ? "Email already in use"
        : "Username already taken",
      409
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      displayName: displayName || username,
      password: hashedPassword,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      userSubscriptions: {
        create: {
          tier: "FREE",
          isActive: true,
          startDate: new Date(),
        },
      },
    },
    include: {
      userSubscriptions: true,
    },
  });

  const { accessToken, refreshToken } = await generateTokens({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  });

  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

  const { password: _, ...userWithoutPassword } = user as any;

  sendSuccess(res, {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  }, 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { userSubscriptions: true },
  });

  if (!user || !user.password) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const { accessToken, refreshToken } = await generateTokens({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  });

  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

  const { password: _, ...userWithoutPassword } = user as any;

  sendSuccess(res, {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  }, 200);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  sendSuccess(res, { message: "Logged out successfully" });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new AppError("Refresh token not found", 401);
  }

  const decoded = await verifyRefreshToken(token);

  if (!decoded || !decoded.id) {
    throw new AppError("Invalid refresh token", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, email: true, username: true, role: true },
  });

  if (!user) {
    throw new AppError("User not found", 401);
  }

  const tokens = await generateTokens({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  });

  res.cookie("refreshToken", tokens.refreshToken, COOKIE_OPTIONS);

  sendSuccess(res, {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("Email is required", 400);
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    sendSuccess(res, { message: "If the email exists, a reset link has been sent" });
    return;
  }

  const resetToken = generateRandomString(64);
  const resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpire,
    },
  });

  sendSuccess(res, { message: "If the email exists, a reset link has been sent" });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;

  if (!token || !password) {
    throw new AppError("Token and password are required", 400);
  }

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpire: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpire: null,
    },
  });

  sendSuccess(res, { message: "Password reset successful" });
});

export const getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Not authenticated", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      avatar: true,
      bio: true,
      createdAt: true,
      updatedAt: true,
      lastLoginAt: true,
      userSubscriptions: true,
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

  sendSuccess(res, { user });
});

export const googleCallback = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { googleId, email, displayName, avatar } = req.user as any;

  if (!googleId || !email) {
    throw new AppError("Google authentication failed", 400);
  }

  let user = await prisma.user.findFirst({
    where: {
      OR: [{ googleId }, { email }],
    },
    include: { userSubscriptions: true },
  });

  if (user) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        googleId: user.googleId || googleId,
        avatar: user.avatar || avatar,
        lastLoginAt: new Date(),
      },
      include: { userSubscriptions: true },
    });
  } else {
    const username = email.split("@")[0] + generateRandomString(6);

    user = await prisma.user.create({
      data: {
        email,
        username,
        displayName: displayName || username,
        googleId,
        avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        isEmailVerified: true,
        userSubscriptions: {
          create: {
            tier: "FREE",
            isActive: true,
            startDate: new Date(),
          },
        },
      },
      include: { userSubscriptions: true },
    });
  }

  const { accessToken, refreshToken } = await generateTokens({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  });

  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
  const redirectUrl = `${clientUrl}/auth/callback?accessToken=${encodeURIComponent(accessToken)}&refreshToken=${encodeURIComponent(refreshToken)}`;

  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

  res.redirect(redirectUrl);
});
