import { Request, Response } from "express"
import Folder from "../models/folderModel"
import Space from "../models/spaceModel"

interface customRequest extends Request{
    user?: any
}

export const createFolder = async (req: customRequest, res: Response): Promise<any> =>{
    if (!req.body.name) {
        return res.status(400).json({ message: 'Folder name is required' });
    }

    try {
        const folder = new Folder(req.body)
        const savedFolder = await folder.save();
        await Space.findByIdAndUpdate(req.body.spaceId, { $push: { folders: savedFolder._id } });
        if(!savedFolder){
            return res.status(404).json({ message: 'Duplicate Folder name' });
        }
        return res.status(201).json({ message: 'Folder created successfully', data: savedFolder });
    } catch (error) {
        console.error('Error creating folder:', error);
        return res.status(400).json({ message: 'Something went wrong' });
    }
}

export const updateFolder = async (req: customRequest, res: Response): Promise<any> =>{
    const {name, privateFolder, folderColor, spaceId} =  req.body
    try {
        const folder = await Folder.findById(req.params.id);
        if (!folder) {
            return res.status(404).json({ error: 'Folder not found' });
        }

        if (name) folder.name = name;
        if (privateFolder !== undefined) folder.privateFolder = privateFolder;
        if (folderColor) folder.folderColor = folderColor;
        if (spaceId) folder.spaceId = spaceId;
        const updatedFolder = await folder.save();
        return res.status(200).json({ message: 'Folder Updated successfully', data: updatedFolder });
    } catch (error) {
        console.error('Error Updating folder:', error);
        return res.status(400).json({ message: 'Something went wrong' });
    }
}

export const deleteFolder = async (req: customRequest, res: Response): Promise<any> =>{
    try {
        const folder = await Folder.findByIdAndDelete(req.params.id);
        if (!folder) {
            return res.status(404).json({ error: 'Folder not found' });
        }
        return res.status(200).json({message: 'Folder deleted successfully'}); 
    } catch (error) {
        console.error('Error deleting folder:', error);
        return res.status(400).json({ message: 'Something went wrong' });
    }
}

export const getFolder = async (req: customRequest, res: Response): Promise<any> =>{
    try {
        const folder = await Folder.findById(req.params.id).populate('lists').exec();
        if (!folder) {
            return res.status(404).json({ error: 'Folder not found' });
        }
        return res.status(200).json({data: folder}); 
    } catch (error) {
        console.error('Error getting folder:', error);
        return res.status(400).json({ message: 'Something went wrong' });
    }
}

export const getAllFolder = async (req: customRequest, res: Response): Promise<any> =>{
    try {
        const folder = await Folder.find({space: req.body.spaceId}).populate('lists').exec()
        if (!folder.length) {
            return res.status(404).json({ error: 'No data found' });
        }
        return res.status(200).json({data: folder}); 
    } catch (error) {
        console.error('Error getting folders:', error);
        return res.status(400).json({ message: 'Something went wrong' });
    }
}