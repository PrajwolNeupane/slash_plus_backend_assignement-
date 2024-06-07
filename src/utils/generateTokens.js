import jwt from "jsonwebtoken";
import "dotenv/config";

// Generate Access and Refresh Tokens
const generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: "30m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: "1d",
    });
    return { accessToken, refreshToken };
};

export default generateTokens;