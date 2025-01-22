import { useAuthContext } from '../../hooks/useAuthContext';


const UserType = () => {
    const { user } = useAuthContext()

    return (user && (user.committee === "Secretary" || user.committee === "Admin"));
};

export default UserType;