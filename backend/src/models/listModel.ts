import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    privateList:{
        type: Boolean,
        default: false,
    },
    listColor:{
        type: String,
        default: '#fff'
    },
    folderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
    }
},
{
    timestamps: true
})

const List = mongoose.model('List', listSchema)

export default List