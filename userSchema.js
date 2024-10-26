import mongoose, { Schema } from "mongoose";

const userTemplate = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    contacts: {
        type: [String],
        default: []
    },
    Activesocket: {
        type: String,
        default: "",
    }
})

const User = mongoose.model('User', userTemplate)

export default User 