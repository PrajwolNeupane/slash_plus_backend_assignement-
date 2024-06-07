import bcrypt from "bcrypt";
import User from "../../model/user.model.js";
import Log from "../../model/log.model.js";
import "dotenv/config";
import errorHandler from "../../utils/errorHandler.js";
import generateAvatarUrl from "../../utils/avatarGenerator.js";
import generateTokens from "../../utils/generateTokens.js";
import useragent from "user-agent"; // Import the user-agent library

export default async function registerUser(req, res) {
    try {
        // Validating Request Body

        if (!req.body.email) {
            return errorHandler({
                res,
                code: 400,
                title: "Cannot Create User",
                message: "Email is required"
            })
        }
        if (!req.body.code) {
            return errorHandler({
                res,
                code: 400,
                title: "Cannot Create User",
                message: "Login Code is required"
            })

        }
        if (req.body.code.length != 6) {
            return errorHandler({
                res,
                code: 400,
                title: "Cannot Create User",
                message: "Login Code must be 6 digits"
            })

        }
        if (req.body.code[5] == "7") {
            return errorHandler({
                res,
                code: 400,
                title: "Cannot Create User",
                message: "Last digit cannot be 7"
            })

        }


        const { email, code } = req.body;
        // Checking if the user exists or not
        const existingUser = await User.findOne({
            email: email,
        });
        if (existingUser) {
            return errorHandler({
                res,
                code: 409,
                title: "Register User",
                message: "User with email already exists",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedCode = await bcrypt.hash(code, salt);

        const user = new User({
            email: email,
            code: hashedCode,
            photo: generateAvatarUrl(email),
        });

        // Save the user and get the created user document
        const createdUser = await user.save();

        // Get device information from the User-Agent header
        const userAgentString = req.headers["user-agent"];
        const userAgentData = useragent.parse(userAgentString);

        const deviceInfo = {
            os: userAgentData.os?.toString() || "Provided",
            device: userAgentData.device?.toString() || "Not",
        };

        // Create a log document only if the user is created successfully
        const log = new Log({
            action: "Account Created",
            user: createdUser._id,
            device: `${deviceInfo.device}-${deviceInfo.os}`,
        });

        await log.save();

        // Generate access and refresh tokens
        const tokens = generateTokens({ userId: createdUser._id });

        return res.json({
            success: true,
            message: "User Registered",
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });
    } catch (e) {
        return errorHandler({
            e,
            res,
            code: 500,
            title: "Register User",
            message: "Server Error on User Registration",
        });
    }
}