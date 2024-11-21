import mongoose, { Document, Model } from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;
    googleId?: string;
    avatar?: string;
    token?: string;
    themeColor?: string;
    tokenExpiry?: string | undefined
    generateAuthToken: () => Promise<string>; 
}

interface UserModel extends Model<UserDocument>{
    findByCredentials(email: string, password: string): Promise<UserDocument>;
}


const isStrongPassword = (password:string):boolean => {
    return validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    });
};

const userSchema = new mongoose.Schema<UserDocument>({
    name: {
        type: String,
        required: [true, 'Username is required.'],
        unique: false,
        trim: true,
    },
    email:{
        type: String,
        unique: true,
        trim: true,
        required: [true, 'Email is required.'],
        lowercase: true,
        validate(value:string){
         if(!validator.isEmail(value)){
            throw new Error('Email is invalid')
         }
        }
    },
    password:{
        type: String,
        required: function() { return !this.googleId; },
        trim: true,
        validate :{
            validator : isStrongPassword,
            message: () => 'Password must be at least 8 characters long, contain uppercase and lowercase letters, a number, and a special character.',
        }
    },
    googleId:{
       type: String,
       default: ''
    },
    avatar:{
        type: String,
    },
    themeColor:{
        type: String,
    },
    token:{
        type: String,
    },
    tokenExpiry:{
        type: Date
    }
},
{
    timestamps: true
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject?.tokenExpiry
    delete userObject?.password

    return userObject
}

userSchema.methods.generateAuthToken = async function(): Promise<any>{
    const user = this
    const token = jwt.sign({id: user._id.toString()}, process.env.JWT_SECRET as string, { expiresIn: '1h' })
    user.token = token
    await user.save()
    return user
}

userSchema.statics.findByCredentials = async function(this: Model<UserDocument>, email, password){
    const user = await this.findOne({email})
    if(!user){
        throw new Error('No user found')
    }
    console.log(user.password)
    const isMatch =  await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Invalid Credentials')
    }

    return user
}

const Users = mongoose.model<UserDocument, UserModel>('users', userSchema)

export default Users