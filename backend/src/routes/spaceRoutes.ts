import { Router } from "express";
import { createSpace, updateSpace, getSpace, getAllSpace, deleteSpace } from "../controllers/spaceController";
import { auth } from "../middleware/authenticate";
export const router = Router()

router.post('/space/create', auth, createSpace)
router.put('/space/:id', auth, updateSpace)
router.delete('/space/:id', auth, deleteSpace)
router.get('/space/:id', auth, getSpace)
router.get('/space', auth, getAllSpace)