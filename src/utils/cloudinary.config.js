import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const uploadToCloud = async (filePath) => {
    if (!filePath) return null;
    const byteArrayBuffer = fs.readFileSync(filePath);
    try {
        const response = await new Promise({ resource_type: "auto" },(resolve, reject) => {
            cloudinary.v2.uploader.upload_stream((error, uploadResult) => {
                if (error) {
                    return reject(error);
                }
                return resolve(uploadResult);
            }).end(byteArrayBuffer);
        })
        console.log(`Buffer upload_stream wth promise success - ${response.public_id}`);
    } catch (error) {
        console.error(error);
    }
}

export default uploadToCloud