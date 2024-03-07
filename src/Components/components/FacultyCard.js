import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarDays, faXmark, faCircleInfo, faCarBattery, faFileLines, faBellSlash,
    faLaptopCode, faHelmetSafety, faGears, faFlaskVial, faBookBookmark, faHouse, faLocationDot, faInfoCircle,
    faBuilding, faMapLocationDot, faCarSide, faFilePdf, faCreditCard, faGraduationCap, faFutbol
} from '@fortawesome/free-solid-svg-icons';

const FacultyCard = ({ faculty, languageText }) => {


    const faculties = ({ icon, fac }) => {
        return (
            <>
                <FontAwesomeIcon icon={icon} />
                <p>{languageText[fac]}</p>
            </>
        )
    }

    return (
        <>
            {faculty === "Electrical Engineering" ? (
                faculties({ icon: faCarBattery, fac: 'FKE' })
            ) : faculty === "Computer Science" ? (
                faculties({ icon: faLaptopCode, fac: 'FC' })
            ) : faculty === "Civil Engineering" ? (
                faculties({ icon: faHelmetSafety, fac: 'FKA' })
            ) : faculty === "Mechanical Engineering" ? (
                faculties({ icon: faGears, fac: 'FKM' })
            ) : faculty === "Chemical Engineering" ? (
                faculties({ icon: faFlaskVial, fac: 'FKT' })
            ) : faculty === "Bridging & Foundation" ? (
                faculties({ icon: faBookBookmark, fac: 'Found' })
            ) : faculty === "Architecture" ? (
                faculties({ icon: faHouse, fac: 'Arch' })
            ) : (
                faculties({ icon: faBookBookmark, fac: 'Found' })
            )}
        </>
    );
}

export default FacultyCard;