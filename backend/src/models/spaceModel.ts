import mongoose from "mongoose";

const spaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description:{
        type: String,
        trim: true,
    },
    privateSpace:{
        type: Boolean,
        default: false,
    },
    spaceColor:{
        type: String,
        default: '#fff'
    },
    icon:{
        type: String
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    teamMembers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    // folders: [{ 
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'Folder' 
    // }],
},
{
    timestamps: true,
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }
})


spaceSchema.virtual('foldersList', {
    ref: 'Folder', // the model to use
    localField: '_id', // field in the Space model
    foreignField: 'spaceId', // field in the Folder model
});

spaceSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret.id; // Remove the `id` field
        return ret;
    }
});

const Space = mongoose.model('Space', spaceSchema)

export default Space