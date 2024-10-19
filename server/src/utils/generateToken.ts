import jwt from "jsonwebtoken";
import { IUserDocument } from "../models/user.model.ts";
import { Response } from "express";

import { ServerConfig } from '../config/index.ts';

export const generateToken = (res:Response, user:IUserDocument ) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  const token= jwt.sign({ userId:user._id }, process.env.JWT_SECRET, {
    expiresIn: '2d',
  });
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return token;
};

