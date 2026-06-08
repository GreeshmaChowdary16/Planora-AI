import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import AppError from '../utils/appError';
import { generateToken } from '../utils/token';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  console.log(`[Auth Controller] Register request received for email: ${email}`);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn(`[Auth Controller] Registration aborted: Email ${email} already registered.`);
      return next(new AppError('A user with this email address already exists.', 400));
    }

    console.log(`[Auth Controller] Registering new user: ${email}...`);
    const user = await User.create({
      name,
      email,
      password,
    });

    console.log(`✅ [Auth Controller] MongoDB Save Success: User created with ID: ${user._id}`);
    const token = generateToken(user._id.toString(), user.email);

    res.status(201).json({
      status: 'success',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(`❌ [Auth Controller] Register Error:`, error);
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  console.log(`[Auth Controller] Login request received for email: ${email}`);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.warn(`[Auth Controller] Login aborted: Email ${email} not found in database.`);
      return next(new AppError('Invalid email or password credentials.', 401));
    }

    console.log(`[Auth Controller] User found in database. Verifying password...`);
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.warn(`[Auth Controller] Login aborted: Incorrect password for ${email}.`);
      return next(new AppError('Invalid email or password credentials.', 401));
    }

    console.log(`✅ [Auth Controller] Password match success. Generating token for ${email}...`);
    const token = generateToken(user._id.toString(), user.email);

    res.status(200).json({
      status: 'success',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(`❌ [Auth Controller] Login Error:`, error);
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('User session not found.', 404));
    }

    console.log(`[Auth Controller] Fetching user profile for ID: ${req.user.id}`);
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.warn(`[Auth Controller] Profile fetch aborted: User ID ${req.user.id} not found.`);
      return next(new AppError('User account not found.', 404));
    }

    res.status(200).json({
      status: 'success',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
export default { register, login, getMe };
