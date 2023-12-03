import {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {FaSignInAlt} from 'react-icons/fa';

import { login, reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';

function Login() {
    const  [formData, setFormData] = useState({
        username: ''
    });

    const {username} = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {user, isLoading, isError, isSuccess, message} = useSelector((state)=>state.auth)

    useEffect(() => {
        if(isError){
            toast.error(message)
        }
        if(isSuccess || user){
            navigate('/')
        }
        dispatch(reset())
    }, [user, isError, isSuccess, message, navigate, dispatch])

    const onChange = (e) => {
        setFormData({username: e.target.value})
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const userData ={
            username
        }
        dispatch(login(userData))
    }
    const isInputValid = username.length > 1;
    const inputStyle = isInputValid ? {} : { borderColor: 'red' };

    if(isLoading){
        return <Spinner />
    }

    return (
        <>
        <section className="heading">
            <h1>
                <FaSignInAlt /> Login
            </h1>
            {/* <p>Session timed out. You need to log in.</p> */}
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
                    {!isInputValid && <p style={{ color: 'red' }}>Please enter your username.</p>}
                </div>
                <div className='form-group'>
                    <button disabled={!isInputValid} type='submit' className='btn btn-block'>Submit</button>
                </div>
            </form>
        </section>
        </>
    )
}

export default Login