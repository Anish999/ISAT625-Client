import { FaSignInAlt, FaSignOutAlt, FaUser} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {logout, reset} from '../features/auth/authSlice'
import Cookies from 'js-cookie';

function Header() {

    const cookieUser = Cookies.get('user');
    const loggedInUser = cookieUser ? JSON.parse(cookieUser):null;

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.auth)
    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/')
    }
    return (
        <header className='header'>
            <div className='logo'>
                <Link to='/'>ISAT-625</Link>
            </div>
            <ul>
                {user ? (
                    <li>
                        <Link to="/login" onClick={onLogout} data-toggle="tooltip" data-placement="right" title="Sign out">
                           {loggedInUser? loggedInUser.username : 'Logout'} <span className='pl-1'><FaSignOutAlt /></span>
                        </Link>
                    </li>
                ) : (
                    <>
                        <li>
                            <Link to='/login'>
                                <FaSignInAlt /> Login
                            </Link>
                        </li>
                        <li>
                            <Link to='/register'>
                                <FaUser /> Register
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </header>
    )
}

export default Header