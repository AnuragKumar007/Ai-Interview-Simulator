import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const footer = () =>{
    const navigate = useNavigate();
    return (
        <footer className="flex flex-col justify-center items-center  p-12 ">
            <div className="text-[#34495E]  flex space-x-16">
                {/* <a href="">Contact Us</a> */}
                <NavLink to="/contact">Contact Us</NavLink>
                <a href="">Support & How-to Videos</a>
                <a href="">Popular Job Roles</a>
                <a href="">Privacy Policy</a>
                <a href="">Terms of Service</a>
                <a href="">FAQ</a>
            </div>
            <div className="flex space-x-16 mt-12">
                <FontAwesomeIcon className='text-2xl' icon={faFacebook} />
                <FontAwesomeIcon className='text-2xl' icon={faTwitter} />
                <FontAwesomeIcon className='text-2xl' icon={faLinkedin} />
                <FontAwesomeIcon className='text-2xl' icon={faInstagram} />
            </div>
            <div className="mt-12 text-sm">
                <p>© 2025 Interview Papa, All Rights Reserved. | Lucknow, Uttar Pradesh, IN 226017</p>
            </div>
        </footer>
    )
}
export default footer;