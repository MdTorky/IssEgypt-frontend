import roleChecker from '../Members/MemberLoader'
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Swal from 'sweetalert2'
import 'animate.css';
import { Icon } from '@iconify/react';

const MemberCard = ({ member, languageText, language }) => {

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
            });
        }
    };

    useEffect(() => {
        const peopleCards = document.querySelectorAll('.moreInfo');


        peopleCards.forEach((card, index) => {
            card.style.animationDelay = `${0.2 * index}s`; // Adjust the delay as needed
        });
    }, []);

    return (
        <Link to={`/members/${member._id}`} className='moreInfo'>
            <div className="mCard" key={member._id}>
                <div className="mBorder">
                    <div className='back2' />
                    <div className="mImg">
                        <img src={member.img} alt="" />

                    </div>
                    <Link onClick={() => window.open(`http://wa.me/${member.phone}`, '_blank')}>

                        <Icon icon="ic:baseline-whatsapp" className="mLink whatsApp" />
                    </Link>
                    <Link onClick={() => window.open(`mailto:${member.email}`, '_blank')}>
                        <Icon icon="entypo:email" className="mLink email" />
                    </Link>
                    <Link onClick={handleLinkedInClick}>
                        <Icon icon="uil:linkedin" className="mLink linkedIn" />
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
            </div>
        </Link>
    );
}

export default MemberCard;