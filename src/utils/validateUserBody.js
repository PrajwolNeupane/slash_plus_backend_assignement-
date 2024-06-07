import errorHandler from "./errorHandler.js"

export default function validateUserBody(req, res) {
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
}