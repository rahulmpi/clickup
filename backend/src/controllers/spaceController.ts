import { Request, Response } from "express"
import Space from "../models/spaceModel";
import mongoose from "mongoose";
import Folder from "../models/folderModel";
import List from "../models/listModel";

interface customRequest extends Request{
    user?: any
}

export const createSpace = async (req: customRequest, res: Response): Promise<any> =>{
    if (!req.body.name) {
        return res.status(400).json({ message: 'Space name is required' });
    }

    try {
        const space = new Space({
            ...req.body,
            userId: req.user._id
        })
        const savedSpace = await space.save();
        if(!savedSpace){
            return res.status(404).json({ message: 'Duplicate space name' });
        }
        return res.status(201).json({ message: 'Space created successfully', data: savedSpace });
    } catch (error) {
        console.error('Error creating space:', error);
        return res.status(400).json({ message: 'Something went wrong' });
    }
}

export const updateSpace = async (req: customRequest, res: Response): Promise<any> =>{
    const {name, description, privateSpace, spaceColor, icon, owner, teamMembers} =  req.body
    try {
        const space = await Space.findById(req.params.id);
        if (!space) {
            return res.status(404).json({ error: 'Space not found' });
        }

        if (name) space.name = name;
        if (description) space.description = description;
        if (privateSpace !== undefined) space.privateSpace = privateSpace;
        if (spaceColor) space.spaceColor = spaceColor;
        if (icon) space.icon = icon;
        if (owner) space.userId = owner;
        if (teamMembers && Array.isArray(teamMembers)) {
            teamMembers.forEach(member => {
                if (!space.teamMembers.includes(member)) {
                    space.teamMembers.push(member);
                }
            });
        }
        const updatedSpace = await space.save();
        return res.status(200).json({ message: 'Space Updated successfully', data: updatedSpace });
    } catch (error) {
        console.error('Error Updating space:', error);
        return res.status(400).json({ message: 'Something went wrong' });
    }
}

export const deleteSpace = async (req: customRequest, res: Response): Promise<any> =>{
    try {
        const spaceId = req.params.id;

        const folders = await Folder.find({spaceId})
        const folderIds = folders.map(folder => folder._id) 
        await List.deleteMany({folderId : { $in: folderIds}})
        await Folder.deleteMany({spaceId})

        const deletedSpace = await Space.findByIdAndDelete(spaceId)
        if (!deletedSpace) {
            return res.status(404).json({ error: 'Space not found' });
        }
        return res.status(200).json({message: 'Space deleted successfully'}); 
    } catch (error) {
        console.error('Error deleting space:', error);
        return res.status(400).json({ message: 'Something went wrong' });
    }
}

export const getSpace = async (req: customRequest, res: Response): Promise<any> =>{
    try {
        // const space = await Space.findById(req.params.id).populate({
        //     path:'folders',
        //     populate:{
        //         path: 'lists'
        //     }
        // })

        const space = await Space.aggregate([
            {
                $match : { 
                    _id: new mongoose.Types.ObjectId(req.params.id)
                }
            },
            {
                $lookup : {
                    from: 'folders',
                    localField: '_id',
                    foreignField: 'spaceId',
                    as: 'folders'
                }
            },
            {
                $unwind : {
                    path: '$folders', 
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'lists',
                    localField: 'folders._id',
                    foreignField: 'folderId',
                    as: 'folders.lists'
                }
            },
            {
                $group : {
                    _id: '$_id',
                    name: {$first: '$name'},
                    folders: {$push: '$folders'},
                    description: {$first: '$description'},
                    privateSpace: {$first: '$privateSpace'},
                    spaceColor: {$first: '$spaceColor'},
                    userId: {$first: '$userId'},
                    teamMembers: {$first: '$teamMembers'},
                    createdAt: {$first: '$createdAt'},
                }
            }
        ])
        if (!space) {
            return res.status(404).json({ error: 'Space not found' });
        }
        return res.status(200).json({data: space}); 
    } catch (error) {
        console.error('Error getting space:', error);
        return res.status(400).json({ message: 'Something went wrong' });
    }
}

export const getAllSpace = async (req: customRequest, res: Response): Promise<any> =>{
    try {
        const space = await Space.find({owner: req.user._id}).populate({
            path: 'folders',
            populate:{
                path: 'lists'
            }
        })
        if (!space.length) {
            return res.status(404).json({ error: 'No Data found' });
        }
        return res.status(200).json({data: space}); 
    } catch (error) {
        console.error('Error getting spaces:', error);
        return res.status(400).json({ message: 'Something went wrong' });
    }
}