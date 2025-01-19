import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFormsContext } from '../../hooks/useFormContext'
import Loader from '../Loader/Loader'
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Icon } from '@iconify/react';

const GalleryEdit = ({ language, languageText, api, darkMode }) => {

    const { galleries = [], dispatch } = useFormsContext();
    const { id } = useParams();
    const [gallery, setGallery] = useState()
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuthContext()


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${api}/api/gallery/${id}`);
                if (!response.ok) {
                    console.error(`Error fetching form data. Status: ${response.status}, ${response.statusText}`);
                    return;
                }

                const data = await response.json();
                dispatch({
                    type: 'GET_ITEM',
                    collection: "galleries",
                    payload: data,
                });
                setGallery(data);
                console.log(data)
            } catch (error) {
                console.error('An error occurred while fetching form data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [api, id, dispatch]);




    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);


        try {
            const response = await fetch(`${api}/api/gallery/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    folderName: gallery.folderName,
                    arabicFolderName: gallery.arabicFolderName,
                    folderLink: gallery.folderLink,
                    folderImage: gallery.folderImage,
                    icon: gallery.icon,
                    time: gallery.time,
                    session: gallery.session,
                }),
            });


            if (!response.ok) {
                console.error(`Error updating form status. Status: ${response.status}, ${response.statusText}`);
                return;
            }

            // Assuming the API response contains the updated form data
            const updatedGalleryData = await response.json();
            // console.log('Updated Form Data:', updatedMemberData);
            dispatch({
                type: 'UPDATE_ITEM',
                collection: 'galleries',
                payload: { id, changes: updatedGalleryData },
            });

            {
                toast.success(`${languageText.galleryEdited}`, {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: darkMode ? "dark" : "colored",
                    style: {
                        fontFamily: language === 'ar' ?
                            'Noto Kufi Arabic, sans-serif' :
                            'Poppins, sans-serif',
                    },
                });
            }
            setUpdating(false);
            navigate(-1);


        } catch (error) {
            console.error('An error occurred while updating form status:', error);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGallery((prevGallery) => ({
            ...prevGallery,
            [name]: value,
        }));
    };


    return (
        <div className='Form'>
            {loading ? (
                <div><Loader /></div>
            ) : (
                <div className="formBox">
                    {updating &&
                        <div>
                            <p className='Updating'>{languageText.Updating}</p>
                            <Loader />
                        </div>
                    }
                    {!updating && (
                        <form onSubmit={handleUpdate}>
                            <h2>{languageText.editGallery}</h2>

                            <img src={gallery.folderImage} className="MemberEditorImg" />

                            <div className="InputRow">
                                <div className="InputField">
                                    <div className="InputLabelField">
                                        <input
                                            type="text"
                                            className={`input ${(gallery.folderName) ? 'valid' : ''}`}
                                            required
                                            value={gallery.folderName}
                                            id="folderName"
                                            name="folderName"
                                            onChange={handleInputChange}
                                            style={{
                                                direction: "ltr"
                                            }}

                                        />
                                        {!gallery.folderName && <label htmlFor="folderName" className={`LabelInput ${(gallery.folderName) ? 'valid' : ''}`}><Icon icon="fluent:folder-48-filled" /></label>}
                                    </div>
                                </div>
                                <div className="InputField">
                                    <div className="InputLabelField">
                                        <input
                                            type="text"
                                            className={`input ${(gallery.arabicFolderName) ? 'valid' : ''}`}
                                            required
                                            value={gallery.arabicFolderName}
                                            id="arabicFolderName"
                                            name="arabicFolderName"
                                            onChange={handleInputChange}
                                            style={{
                                                direction: "ltr"
                                            }}

                                        />
                                        {!gallery.arabicFolderName && <label htmlFor="arabicFolderName" className={`LabelInput ${(gallery.arabicFolderName) ? 'valid' : ''}`}><Icon icon="fluent:folder-48-filled" /></label>}
                                    </div>
                                </div>
                            </div>

                            <div className="InputRow">
                                <div className="InputField">
                                    <div className="InputLabelField">
                                        <input
                                            type="text"
                                            className={`input ${(gallery.folderLink) ? 'valid' : ''}`}
                                            required
                                            value={gallery.folderLink}
                                            id="folderLink"
                                            name="folderLink"
                                            onChange={handleInputChange}
                                            style={{
                                                direction: "ltr"
                                            }}

                                        />
                                        {!gallery.folderLink && <label htmlFor="folderLink" className={`LabelInput ${(gallery.folderLink) ? 'valid' : ''}`}><Icon icon="fluent:folder-48-filled" /></label>}
                                    </div>
                                </div>
                                <div className="InputField">
                                    <div className="InputLabelField">
                                        <input
                                            type="text"
                                            className={`input ${(gallery.folderImage) ? 'valid' : ''}`}
                                            required
                                            value={gallery.folderImage}
                                            id="folderImage"
                                            name="folderImage"
                                            onChange={handleInputChange}
                                            style={{
                                                direction: "ltr"
                                            }}

                                        />
                                        {!gallery.folderImage && <label htmlFor="folderImage" className={`LabelInput ${(gallery.folderImage) ? 'valid' : ''}`}><Icon icon="fluent:folder-48-filled" /></label>}
                                    </div>
                                </div>
                            </div>

                            <div className="InputRow">
                                <div className="InputField">
                                    <div className="InputLabelField">
                                        <input
                                            type="text"
                                            className={`input ${(gallery.icon) ? 'valid' : ''}`}
                                            required
                                            value={gallery.icon}
                                            id="icon"
                                            name="icon"
                                            onChange={handleInputChange}
                                            style={{
                                                direction: "ltr"
                                            }}

                                        />
                                        {!gallery.icon && <label htmlFor="icon" className={`LabelInput ${(gallery.icon) ? 'valid' : ''}`}><Icon icon="fluent:folder-48-filled" /></label>}
                                    </div>
                                </div>
                                <div className="InputField">
                                    <div className="InputLabelField">
                                        <input
                                            type="text"
                                            className={`input ${(gallery.time) ? 'valid' : ''}`}
                                            required
                                            value={gallery.time}
                                            id="time"
                                            name="time"
                                            onChange={handleInputChange}
                                            style={{
                                                direction: "ltr"
                                            }}

                                        />
                                        {!gallery.time && <label htmlFor="time" className={`LabelInput ${(gallery.time) ? 'valid' : ''}`}><Icon icon="fluent:folder-48-filled" /></label>}
                                    </div>
                                </div>
                            </div>

                            <div className="InputField">
                                <div className="InputLabelField">
                                    <input
                                        type="text"
                                        className={`input ${(gallery.session) ? 'valid' : ''}`}
                                        required
                                        value={gallery.session}
                                        id="session"
                                        name="session"
                                        onChange={handleInputChange}
                                        style={{
                                            direction: "ltr"
                                        }}

                                    />
                                    {!gallery.session && <label htmlFor="session" className={`LabelInput ${(gallery.session) ? 'valid' : ''}`}><Icon icon="fluent:folder-48-filled" /></label>}
                                </div>
                            </div>




                            <button type="submit">{languageText.Update}</button>

                        </form>
                    )}
                </div>
            )}
        </div>
    );
}

export default GalleryEdit