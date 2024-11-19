import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express';
import Users from '../models/usersModel';

interface customRequest extends Request{
  user?: any
}

export const auth = async (req:customRequest, res: Response, next: NextFunction) =>{
   try {
    const authHeader = req.headers['authorization']
    if(authHeader){
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
        const user = await Users.findOne({ _id: decoded.id, token })
        if (!user) {
            res.status(401).json({message: 'user not logged in'})
        }
        req.user = user
        next()
    }
   } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
         res.status(401).json({ message: 'Token has expired' });
      }
     if (error instanceof jwt.JsonWebTokenError) {
         res.status(401).json({ message: 'Invalid token' });
     }
     res.status(500).json({ message: 'Something went wrong' });
   }
}