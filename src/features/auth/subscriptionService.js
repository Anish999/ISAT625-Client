import axios from "axios"
const API_URL = process.env.REACT_APP_API_URL+'subscription/';

const addSubscription = async (user) => {
    const response = await axios.post(API_URL, user);
    return response.data;
}

const removeSubscription = async (data) => {
    const response = await axios.post(API_URL+'unsubscribe', data);
    return response.data;
}


export {addSubscription, removeSubscription}