import mongoose from "mongoose";

const LogModel = new mongoose.Schema({
    action: {
        type: String,
        required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
},
    {
        timestamps: true
    });

const Log = mongoose.model("Log", LogModel);
export default Log;
