import { Router } from "express";
import { createFolder, updateFolder, deleteFolder, getFolder, getAllFolder } from "../controllers/folderController";
import { auth } from "../middleware/authenticate";
export const router = Router()

router.post('/folder/create', auth, createFolder)
router.put('/folder/:id', auth, updateFolder)
router.delete('/folder/:id', auth, deleteFolder)
router.get('/folder/:id', auth, getFolder)
router.post('/folder', auth, getAllFolder)