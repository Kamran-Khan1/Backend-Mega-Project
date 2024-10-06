import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler((req, res) => {
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

  //check if image is given by the user or not:- avatar
  //upload those image to cloudinary
  //create user object - create entry in db
  //remove password and refreshtoken from res
  //check for user creation
  //return response
});

export { registerUser };
