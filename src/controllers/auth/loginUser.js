import bcrypt from "bcrypt";
import User from "../../model/user.model.js";
import Log from "../../model/log.model.js";
import "dotenv/config";
import errorHandler from "../../utils/errorHandler.js";
import generateTokens from "../../utils/generateTokens.js";
import useragent from "user-agent"; // Import the user-agent library

export default async function loginUser(req, res) {
    try {
        // Validating Request Body

        if (!req.body.email) {
            return errorHandler({
                res,
                code: 400,
                title: "Cannot Login User",
                message: "Email is required"
            });
        }
        if (!req.body.code) {
            return errorHandler({
                res,
                code: 400,
                title: "Cannot Login User",
                message: "Login Code is required"
            });
        }
        if (req.body.code.length != 6) {
            return errorHandler({
                res,
                code: 400,
                title: "Cannot Login User",
                message: "Login Code must be 6 digits"
            });
        }

        const { email, code } = req.body;

        // Checking if the user exists or not
        const existingUser = await User.findOne({
            email: email,
        });
        if (!existingUser) {
            return errorHandler({
                res,
                code: 404,
                title: "Login User",
                message: "User with this email does not exist",
            });
        }

        // Verify the provided code with the stored hashed code
        const validCode = await bcrypt.compare(code, existingUser.code);
        if (!validCode) {
            return errorHandler({
                res,
                code: 401,
                title: "Login User",
                message: "Invalid Login Code",
            });
        }

        // Get device information from the User-Agent header
        const userAgentString = req.headers["user-agent"];
        const userAgentData = useragent.parse(userAgentString);

        const deviceInfo = {
            os: userAgentData.os?.toString() || "Provided",
            device: userAgentData.device?.toString() || "Not",
        };

        // Create a log document for successful login
        const log = new Log({
            action: "User Logged In",
            user: existingUser._id,
            device: `${deviceInfo.device}-${deviceInfo.os}`,
        });

        await log.save();

        // Generate access and refresh tokens
        const tokens = generateTokens({ userId: existingUser._id });

        return res.json({
            success: true,
            message: "User Logged In",
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });
    } catch (e) {
        return errorHandler({
            e,
            res,
            code: 500,
            title: "Login User",
            message: "Server Error on User Login",
        });
    }
}
