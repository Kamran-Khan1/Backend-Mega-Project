import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../db/index.js"
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")
            ?.replace("Bearer ", "");

        if (!token) {
            throw new ApiErrors(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            // TODO: discuss about frontend
            throw new ApiErrors(401, "Invalid Access token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiErrors(401, error?.message || "Invalid access token");
    }
})


