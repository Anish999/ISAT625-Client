import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser } from 'react-icons/fa'

import { register, reset } from '../features/auth/authSlice';
import { getAllTopics } from '../features/auth/topicService';
import authService from '../features/auth/authService';
import Spinner from '../components/Spinner';

function Register() {
    const  [formData, setFormData] = useState({
        username: '',
        selectedTopics: []
    });
    const [topicsData, setTopicsData] = useState(null)
    const [displayCount, setDisplayCount] = useState(2)

    const [usernameExistData, setUsernameExistData] = useState(false)

    const {username, selectedTopics} = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {user, isLoading, isError, isSuccess, message} = useSelector((state)=>state.auth)

    useEffect(() => {
        getAlltopics();
        getAllUserName();
        if(isError){
            toast.error(message)
        }
        if(isSuccess || user){
            navigate('/')
        }
        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch])

    const getAlltopics = async() => {
        try{
            const result = await getAllTopics();
            setTopicsData(result);
        } catch( error){
            throw new Error('Topics fetch failed.')
        }
    }

    const getAllUserName = async(name) => {
        try{
            const userData ={
                username : name? name:username
            }
            const result = await authService.checkIfUsernameExist(userData);
            setUsernameExistData(result);
        } catch( error){
            throw new Error('Usernames fetch failed.')
        }
    }

    const onChange = (e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            username: e.target.value
        }))
        getAllUserName(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const userData ={
            username,
            topics: selectedTopics
        }
        dispatch(register(userData))
    }

    const handleSelectTopic = (e) => {
        const value = e.target.value;
        setFormData((prevFormData) => ({
            ...prevFormData,
            selectedTopics: e.target.checked
              ? [...prevFormData.selectedTopics, value] // Add the value to the array
              : prevFormData.selectedTopics.filter((item) => item !== value) // Remove the value from the array
        }));
    }

    const handleShowMore = () => {
        setDisplayCount(topicsData.length);
    }

    const handleShowLess = () => {
        setDisplayCount(2);
    }

    const isInputValid = username.length > 0 && !usernameExistData;
    const inputStyle = isInputValid ? {} : { borderColor: 'red' };

    if(isLoading){
        return <Spinner />
    }

    return (
        <>
        <section className="heading">
            <h1>
                <FaUser /> Register
            </h1>
        </section>
        <section className="form">
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-controls"
                        style={inputStyle} 
                        id="username" 
                        name='username' 
                        value={username} 
                        placeholder='Desired User Name' 
                        onChange={onChange}/>
                    {!isInputValid && username.length <=0
                        && <p style={{ color: 'red' }}>Enter your desired username.</p>}
                    {!isInputValid && username.length >0
                        && <p style={{ color: 'red' }}>The username already exist. Please try a different one.</p>}
                </div>
                {isInputValid && 
                    <div className='register-select-topics'>
                        <div><h3>Select Topics to Subscribe:</h3></div>
                        <ul>
                            {topicsData.slice(0, displayCount).map((item, index) => (
                            <li className='pl-2 lh-1' key={index}>
                                <input type="checkbox" value={item._id} onChange={handleSelectTopic}/>
                                <span className='pl-1'>{item.name}</span>
                            </li>
                            ))}
                            <li className='pl-2 lh-1' key={topicsData.length}>
                            {displayCount<topicsData.length?
                                <button type="button" className='custom-btn-link' onClick={handleShowMore}>
                                    <>Show More</>
                                </button> :
                                <button type="button" className='custom-btn-link' onClick={handleShowLess}>
                                <>Show Less</>
                            </button> 
                            }
                            </li>
                        </ul>
                    </div>
                }
                <div className='form-group'>
                    <button disabled={!isInputValid} type='submit' className='btn btn-block'>Submit</button>
                </div>
            </form>
        </section>
        </>
    )
}

export default Register