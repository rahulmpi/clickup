import Users from "../models/usersModel";
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt'

export const findUser = async (key:any) =>{
   return await Users.findOne(key)
}

export const saveNewUser = async (userData: any) =>{
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);
    const user =  new Users(userData)
    await user.save()
}

export const createToken = async(user:any) =>{
    user.token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    user.tokenExpiry = Date.now() + 60000;
    await user.save();
    return user
}

// export const saveGoogleUser = async (data:any) =>{
//     const {sub:googleId, email, name, picture} = data
//     const user = await Users.findOneAndUpdate({ googleId },{ googleId, name, email, avatar: picture },{ new: true, upsert: true } );
//     user.token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
//     await user.save();
//     return user
// }

export const saveGoogleUser = async (data:any) =>{
    const {sub:googleId, email, name, picture} = data
    let user = await Users.findOneAndUpdate({ googleId },{ googleId, name, email, avatar: picture },{ new: true, upsert: true } );
    return await createToken(user)
}

export const findUserByToken = async(token:string) =>{
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
    const user = await Users.findById(decoded.id)
    return user
}