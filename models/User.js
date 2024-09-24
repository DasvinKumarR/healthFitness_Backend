import mongoose from "mongoose";
// users schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    profile: {
        height: {type: Number, default: 0},
        weight: {type: Number, default: 0},
        age: {type: Number, default: 0}
    },
    resetToken: {type: String},
    resetTokenExpiration: Date,
    isActive: {type: Boolean, default: false},
    token: String,
});

export default mongoose.model('User', UserSchema);