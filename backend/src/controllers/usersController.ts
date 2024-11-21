import axios from "axios";
import bcrypt from 'bcrypt'
import Users from "../models/usersModel";
import { findUser, saveNewUser, saveGoogleUser, createToken, findUserByToken } from "../services/usersServices";
import { Request, Response } from 'express';
import { sendEmail } from "../utilities/helper";

interface customRequest extends Request {
   user?: any;
}

export const userRegister = async (req: customRequest, res: Response): Promise<any> => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    try {
        let user = await findUser({email});
        if (user) {
            return res.status(400).json({ error: 'Email already taken' });
        }
       
        await saveNewUser(req.body);
        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Error creating user' });
    }
};

export const userLogin = async (req: customRequest, res: Response): Promise<any> => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email & Password are required' });
        }
        const users = await Users.findByCredentials(email, password);
        const user = await users.generateAuthToken();
        return res.status(200).json({ user });
    } catch (error:any) {
        console.error('Login error:', error);
        return res.status(400).json({ error: error.message });
    }
};

export const userGoogleLogin = async (req: customRequest, res: Response): Promise<any> => {
    const { idToken } = req.body;
    if (!idToken) {
        return res.status(400).json({ error: 'ID Token is required' });
      }
    try {
        const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
        console.log(response.data)
        let user = await saveGoogleUser(response.data);
        return res.status(200).json({ user });
    } catch (error) {
        console.error('Google login error:', error);
        return res.status(400).json({ error: 'Something went wrong'});
    }
};

export const userLogout = async (req: customRequest, res: Response): Promise<any> => {
    try {
        req.user.token = '';
        await req.user.save();
        return res.status(200).json({message: 'Logout Successfully'})
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ error: 'Something went wrong'});
    }
};

export const forgotPassword = async (req:customRequest, res: Response): Promise<any> =>{
    try {
      const email = req.body
      let user = await findUser(email)
      if(!user){
        return res.status(404).send('user not found');
      }
      user = await createToken(user)

      if(user){
        const resetUrl = `${process.env.REACT_APP_URL}/reset-password/${user.token}`
        await sendEmail(user.email, `Click here to reset your password: <a href="${resetUrl}">Reset Password</a>`, 'Password Reset').catch(console.error)
        return res.status(200).json({ message: 'Password reset email sent'})
      }
    } catch (error) {
        console.error('Forgot password error:', error);
         return res.status(500).json({ error: 'Something went wrong'});
    }
}

export const resetPassword = async (req:customRequest, res: Response): Promise<any> =>{
    const {token} = req.params
    console.log(token)
    const { newPassword } = req.body;
    try {
        const user = await findUserByToken(token)
        if (!user || user.token !== token || (user.tokenExpiry && new Date(user.tokenExpiry).getTime() < Date.now())) {
            return res.status(400).json({ error: 'Token is invalid or has expired' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.token = '';
        user.tokenExpiry = '';
        await user.save()
        return res.status(200).json({message: 'Password has been reset'});
    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({ error: 'Something went wrong'});
    }
}