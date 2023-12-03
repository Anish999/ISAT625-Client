import axios from "axios"
const API_URL = '/api/topics/';

const getAllTopics = async (data) => {
    const response = await axios.post(API_URL+'getTopic', data);
    return response.data;
}



export {getAllTopics}