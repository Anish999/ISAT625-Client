import axios from "axios"
const API_URL = process.env.REACT_APP_API_URL+'posts/';

const getAllPosts = async (user) => {
    const response = await axios.post(API_URL+'getPosts', user);
    return response.data;
}

const createPost = async (post) => {
    const response = await axios.post(API_URL, post);
    return response.data;
}


export {getAllPosts, createPost}