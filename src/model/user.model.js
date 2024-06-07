import mongoose from "mongoose";

const UserModel = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    photo: { type: String, required: true },
    code: {
        type: String,
        required: true,
    },
});

const User = mongoose.model("User", UserModel);
export default User;
