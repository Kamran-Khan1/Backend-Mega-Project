import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/users.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";


const generateAccessAndRefreshToken = async (userId) => {
  try {
    // Fetch the user by ID
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiErrors(404, "User not found");
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken(); // Fixed typo here

    // Set the refresh token on the user document
    user.refreshToken = refreshToken;

    // Save the user instance (not the User model)
    await user.save({ validateBeforeSave: false });

    // Return the generated tokens
    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error); // Optional: log the actual error for debugging
    throw new ApiErrors(500, "Something went wrong saving refresh and access Token");
  }
};



const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  const { username, email, fullname, password } = req.body;

  console.log(
    `email: ${email} , username: ${username}, fullname: ${fullname}, password: ${password}`
  );

  //validation - not empty
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiErrors(400, "All fields are required")
  }

  //check user already exists: username , email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiErrors(409, "This user allready exists");
  };

  //check if image is given by the user or not:- avatar
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;//This line
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;//and this line is not equal see carefully

  //We have to check if avatar was given by the user or not
  if (!avatarLocalPath) {
    throw new ApiErrors(400, "avatar is required")
  };

  //upload those image to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  // console.log(coverImage);
  //Check if avatar is uploaded or not.....
  if (!avatar) {
    throw new ApiErrors(400, "avatar is required")
  };

  //create user object - create entry in db
  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });
  //remove password and refreshtoken from res
  const createdUser = await User.findById(user._id).select(
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

const loginUser = asyncHandler(async (req, res) => {

  //TO-DO=>
  //req.body -> data from user
  //username or email
  //find username or email on database
  //password is matching or not -> from database
  //AccessToken and RefreshToken generate 
  //send cookies

  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiErrors(400, "username or password is required");
  };

  const user = await User.findOne({
    $or: [{username}, {email}], // This is a little mistake 😣
  });

  if (!user) {
    throw new ApiErrors(404, "User does not exist");
  };

  const isPasswordValid = user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiErrors(401, "Password didn't match");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const option = {
    httpOnly: true,
    secure: true,
    //When we send cookies to browser the cookies can not be modified from frontend It's only modifiable from server.
  }
  return res
    .status(200)
    .cookie("refreshToken", refreshToken, option)
    .cookie("accessToken", accessToken, option)
    .json(
      new ApiResponse(200, {
        user: loggedInUser, refreshToken, accessToken
      }, "User logged in Successfully")
    )
})

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set : {
        refreshToken : undefined,
      },
    }, 
    {
      new : true,
    }
  )

  const option = {
    httpOnly: true,
    secure: true,
    //When we send cookies to browser the cookies can not be modified from frontend It's only modifiable from server.
  }

  res.status(200)
  .clearCookie("accessToken", option)
  .clearCookie("refreshToken", option)
  .json(new ApiResponse(200, {} , "User logged out successfully"));

})

export { registerUser, loginUser, logoutUser };
