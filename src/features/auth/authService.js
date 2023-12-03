import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.REACT_APP_API_URL+'users/';

const cookieVisited = Cookies.get('visited-isat');
const isVisited = cookieVisited ? JSON.parse(cookieVisited):null;


//Register user
const register =  async (userData) =>{
    const response = await axios.post(API_URL, userData);

    if(response.data){
        Cookies.set('user', JSON.stringify(response.data), { expires: 1 }); // expires in 1 day
        if(isVisited){
            Cookies.remove('visited-isat');
        }
        Cookies.set('visited-isat', JSON.stringify(true), { expires: 365 }); // expires in 1 year
    }
    return response.data;
}

//Login user
const login =  async (userData) =>{
    const response = await axios.post(API_URL + 'login', userData);

    if(response.data){
        Cookies.set('user', JSON.stringify(response.data), { expires: new Date(new Date().getTime()+24*60*60*1000) }); // expires in 7 days
        if(isVisited){
            Cookies.remove('visited-isat');
        }
        Cookies.set('visited-isat', JSON.stringify(true), { expires: 365 }); // expires in 1 year
    }
    return response.data;
}

//Logout user
const logout = () => {
    Cookies.remove('user');
}

//Get all usernames for dropdown
const checkIfUsernameExist = async (userData) => {
    const response = await axios.post(API_URL+'usernames', userData);
    return response.data;
}

const authService = {
    register,
    logout,
    login,
    checkIfUsernameExist
}

export default authService