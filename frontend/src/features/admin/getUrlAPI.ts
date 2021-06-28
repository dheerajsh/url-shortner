import axios from "axios";
import { BACKEND_SERVICE_URL } from "../../Constants";

export async function getAllUrl() {
 return await axios.get(`${BACKEND_SERVICE_URL}?limit=100`)

}
