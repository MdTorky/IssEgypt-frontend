import roleChecker from '../Members/MemberLoader'
import { useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEnvelope, faUserSlash
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'animate.css';
const MemberCard = ({ api, member, languageText, language }) => {
    const stopPropagation = (e) => {
        e.stopPropagation();
    };
    const MySwal = withReactContent(Swal)
    // const font = language === 'en' ? 'Poppins, sans-serif' : 'Noto Kufi Arabic, sans-serif;';

    const handleLinkedInClick = () => {
        if (member.linkedIn) {
            window.open(member.linkedIn);
        } else {
            Swal.fire({
                title: languageText.noLinkedIn,
                showClass: {
                    popup: 'animate__animated animate__fadeInUp animate__faster',
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutDown animate__faster',
                },
                confirmButtonText: 'OK', // Custom text for the "OK" button
                confirmButtonColor: 'var(--theme)',
                // font: font 
            });
        }
    };

    return (
        <Link to={`/members/${member._id}`} className='moreInfo'>
            <div className="mCard" key={member._id}>
                <div className="mBorder">
                    <div className='back2' />
                    <div className="mImg">
                        <img src={`${api}/${member.img}`} alt="" />
                    </div>
                    {/* Use onClick to stop propagation of the click event */}
                    <Link to={`http://wa.me/${member.phone}`} onClick={stopPropagation}>
                        <FontAwesomeIcon icon={faWhatsapp} className="mLink whatsApp" />
                    </Link>
                    <Link to={`mailto:${member.email}`} onClick={stopPropagation}>
                        <FontAwesomeIcon icon={faEnvelope} className="mLink email" />
                    </Link>
                    <Link onClick={handleLinkedInClick}>
                        <FontAwesomeIcon icon={faLinkedin} className="mLink linkedIn" />
                    </Link>
                </div>
                <div className="mName">
                    {language === 'ar' ? <p>{member.arabicName}</p> : <p>{member.name}</p>}
                </div>
                <div
                    key={member._id}
                    className={`mInfo ${member.index % 2 === 0 ? 'even' : 'odd'
                        }`}>
                    <p className="role">{roleChecker({ languageText: languageText, committee: member.committee, role: member.type })}</p>
                </div>
                {/* Use Link component for More Info */}
            </div>
        </Link>
    );
}

export default MemberCard;