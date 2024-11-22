import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ServerConfig } from "../config/index.ts";

declare global {
    namespace Express{
        interface Request {
            id: string;
        }
    }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;
        console.log("token",token)
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }
        // verify the tokn
        
        const decode = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;




        // check if decoding was successfull
        if (!decode) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            })
        }
        console.log("decode : ",decode)
        req.id = (decode as any).userId;
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}