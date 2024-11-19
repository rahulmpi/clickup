import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    privateFolder:{
        type: Boolean,
        default: false,
    },
    folderColor:{
        type: String,
        default: '#fff'
    },
    spaceId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Space',
    },
    lists:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List'
    }]
},
{
    timestamps: true,
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }
})

folderSchema.virtual('listsItems', {
    ref: 'List', // the model to use
    localField: '_id', // field in the folder model
    foreignField: 'folderId', // field in the list model
});

folderSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret.id; // Remove the `id` field
        return ret;
    }
});


const Folder = mongoose.model('Folder', folderSchema)

export default Folder