import { Router } from "express";
import { createList, updateList, deleteList, getList, getAllList } from "../controllers/listController";
import { auth } from "../middleware/authenticate";
export const router = Router()

router.post('/list/create', auth, createList)
router.put('/list/:id', auth, updateList)
router.delete('/list/:id', auth, deleteList)
router.get('/list/:id', auth, getList)
router.post('/list', auth, getAllList)