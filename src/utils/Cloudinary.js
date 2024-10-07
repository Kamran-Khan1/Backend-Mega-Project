import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // Use promises for async file handling

// Configuration
cloudinary.config({
  cloud_name: "kamran0",
  api_key: 274274242276222,
  api_secret: "wOViEc1-d93MeuEjb1DCVcUe66w",
});


// Upload a File
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })
    // file has been uploaded successfull
    // console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath)
    return response;

  } catch (error) {
    fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

export { uploadOnCloudinary };
