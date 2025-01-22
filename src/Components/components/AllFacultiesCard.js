import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarDays, faXmark, faCircleInfo, faCarBattery, faFileLines, faBellSlash,
    faLaptopCode, faHelmetSafety, faGears, faFlaskVial, faBookBookmark, faEnvelope, faLocationDot, faInfoCircle,
    faBuilding, faMapLocationDot, faCarSide, faFilePdf, faCreditCard, faGraduationCap, faFutbol
} from '@fortawesome/free-solid-svg-icons';

const AllFacultyCard = ({ facultyId, languageText }) => {


    const faculties = ({ fac }) => {
        return (
            <>
                {languageText[fac]}
            </>
        )
    }

    return (
        <>
            {facultyId === "FKE" ? (
                faculties({ fac: 'FKE' })
            ) : facultyId === "FC" ? (
                faculties({ fac: 'FC' })
            ) : facultyId === "FKA" ? (
                faculties({ fac: 'FKA' })
            ) : facultyId === "FKM" ? (
                faculties({ fac: 'FKM' })
            ) : facultyId === "FKT" ? (
                faculties({ fac: 'FKT' })
            ) : facultyId === "Space" ? (
                faculties({ fac: "Space" })
            ) : facultyId === "FBME" ? (
                faculties({ fac: "FBME" })
            ) : facultyId === "FAB" ? (
                faculties({ fac: "FAB" })
            ) : facultyId === "FGHT" ? (
                faculties({ fac: "FGHT" })
            ) : facultyId === "FP" ? (
                faculties({ fac: "FP" })
            ) : facultyId === "FM" ? (
                faculties({ fac: "FM" })
            ) : facultyId === "FS" ? (
                faculties({ fac: "FS" })
            ) : facultyId === "FIC" ? (
                faculties({ fac: "FIC" })
            ) : (
                faculties({ fac: 'Space' })
            )}
        </>
    );
}

export default AllFacultyCard;