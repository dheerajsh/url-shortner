import axios from "axios";
import { BACKEND_SERVICE_URL } from "../../Constants";

// A mock function to mimic making an async request for data
export async function createShortUrl(originalUrl: string, userId: string) {
  console.log(BACKEND_SERVICE_URL, originalUrl)
 return await axios.post(BACKEND_SERVICE_URL, {
    originalUrl,
    userId
  })

}
