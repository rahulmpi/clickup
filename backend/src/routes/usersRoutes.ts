import { Router } from "express";
import { userRegister, userLogin, userGoogleLogin, userLogout, forgotPassword, resetPassword } from "../controllers/usersController";
import { auth } from "../middleware/authenticate";
export const router = Router()

router.post('/register', userRegister);

router.post('/login', userLogin);

router.post('/auth/google', userGoogleLogin)

router.post('/logout', auth, userLogout);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);