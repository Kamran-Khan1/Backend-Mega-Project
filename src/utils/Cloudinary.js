import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; //File system এইটা দিয়ে ফাইল Handle করা হয়

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload a File
const uploadOnCloudinary = async (fileUplaoadURL) => {
  try {
    if (!fileUplaoadURL) return null;
    //Upload the file on cloudinary
    const uploadResult = await cloudinary.uploader.upload(fileUplaoadURL, {
      resource_type: "auto",
    });
    //File upload successfully
    console.log("File uploaded successfully in cloudinary");
    return uploadResult;
  } catch (error) {
    fs.unlink(fileUplaoadURL); //removed the locally saved temporary file as the upload operation got failed
    return null;
  }
};

export { uploadOnCloudinary };
