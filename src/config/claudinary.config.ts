import { v2 as cloudinary } from "cloudinary";
import envConfig from "./route.config";

cloudinary.config({
  cloud_name: envConfig.CLAUDINARY_CLOUD_NAME,
  api_key: envConfig.CLAUDINARY_API_KEY,
  api_secret: envConfig.CLAUDINARY_API_SECRET,
});

export default cloudinary;
