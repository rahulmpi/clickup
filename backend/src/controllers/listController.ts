import { Request, Response } from "express"
import List from "../models/listModel"
import Folder from "../models/folderModel"

interface customRequest extends Request{
    user?: any
}

export const createList = async (req: customRequest, res: Response): Promise<any> =>{
    if (!req.body.name) {
        return res.status(400).json({ message: 'List name is required' });
    }

    try {
        const list = new List(req.body)
        const savedList = await list.save();
        console.log(savedList)
        await Folder.findByIdAndUpdate(req.body.folderId, { $push: { lists: savedList._id } });
        if(!savedList){
            return res.status(404).json({ message: 'Duplicate List name' });
        }
        return res.status(201).json({ message: 'List created successfully', data: savedList });
    } catch (error) {
        console.error('Error creating list:', error);
        return res.status(400).json({ message: 'Something went wrong' });
    }
}

export const updateList = async (req: customRequest, res: Response): Promise<any> =>{
    const {name, privateList, listColor, folderId} =  req.body
    try {
        const list = await List.findById(req.params.id);
        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        if (name) list.name = name;
        if (privateList !== undefined) list.privateList = privateList;
        if (listColor) list.listColor = listColor;
        if (folderId) list.folderId = folderId;
        const updatedList = await list.save();
        return res.status(200).json({ message: 'List Updated successfully', data: updatedList });
    } catch (error) {
        console.error('Error Updating list:', error);
        return res.status(400).json({ message: 'Something went wrong' });
    }
}

export const deleteList = async (req: customRequest, res: Response): Promise<any> =>{
    try {
        const list = await List.findByIdAndDelete(req.params.id);
        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }
        return res.status(200).json({message: 'List deleted successfully'}); 
    } catch (error) {
        console.error('Error deleting list:', error);
        return res.status(400).json({ message: 'Something went wrong' });
    }
}

export const getList = async (req: customRequest, res: Response): Promise<any> =>{
    try {
        const list = await List.findById(req.params.id);
        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }
        return res.status(200).json({data: list}); 
    } catch (error) {
        console.error('Error getting list:', error);
        return res.status(400).json({ message: 'Something went wrong' });
    }
}

export const getAllList = async (req: customRequest, res: Response): Promise<any> =>{
    try {
        const list = await List.find({folder: req.body.folderId})
        if (!list.length) {
            return res.status(404).json({ error: 'No data found' });
        }
        return res.status(200).json({data: list}); 
    } catch (error) {
        console.error('Error getting lists:', error);
        return res.status(400).json({ message: 'Something went wrong' });
    }
}