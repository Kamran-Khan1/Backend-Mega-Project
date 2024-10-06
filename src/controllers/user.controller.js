import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/users.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  const { username, email, fullname, password } = req.body;

  console.log(
    `email: ${email} , username: ${username}, fullname: ${fullname}, password: ${password}`
  );
  //validation - not empty
  if (!email || !username || !fullname || !password) {
    throw new ApiErrors(400, "All fields are required");
  }
  //check user already exists: username , email
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiErrors(409, "This user allready exists");
  };
  //check if image is given by the user or not:- avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  //We have to check if avatar was given by the user or not
  if (!avatarLocalPath) {
    throw new ApiErrors(400, "avatar is required")
  };
  //upload those image to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  //Check if avatar is uploaded or not.....
  if (!avatar) {
    throw new ApiErrors(400, "avatar is required")
  };
  //create user object - create entry in db
  const user = User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });
  //remove password and refreshtoken from res
  const createdUser = User.findById(user._id).select(
    "-password -refreshToken"
  )
  //check for user creation
  if (!createdUser) {
    throw new ApiErrors(500, "Something went wrong while creating the user");
  }
  //return response
  return res.status(201).json(
    new ApiResponse(201, createdUser, "User Registered Successfully")
  );

});

export { registerUser };
