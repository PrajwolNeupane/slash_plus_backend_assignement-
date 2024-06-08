import User from "../../model/user.model.js";
import Log from '../../model/log.model.js';
import errorHandler from "../../utils/errorHandler.js";

export default async function getDashboard(req, res) {
    try {
        const userId = req.user.userId;
        const [userCount, loginCount, log] = await Promise.all([
            User.countDocuments(),
            Log.countDocuments({ user: userId, action: "User Logged In" }),
            Log.find({ user: userId }, { __v: 0 }).sort({ createdAt: -1 }).lean(),
        ]);

        res.json({
            success: true,
            message: "User Data Fetched",
            data: {
                userCount,
                loginCount,
                log,
            },
        });
    } catch (e) {
        return errorHandler({
            e,
            res,
            code: 500,
            title: "Dashboard Data Error",
            message: "Server Error on Dashboard Data",
        });
    }
}