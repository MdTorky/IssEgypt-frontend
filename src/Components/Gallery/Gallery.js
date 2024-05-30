import React from 'react'
import "./Gallery.css"
import { Icon } from '@iconify/react';
import Loader from '../Loader/Loader'
import { useFormsContext } from '../../hooks/useFormContext'
import { useState, useEffect } from "react"


const Gallery = ({ api, languageData, language, darkMode }) => {


    const languageText = languageData[language];
    const { galleries, dispatch } = useFormsContext()
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');



    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${api}/api/gallery`);
                if (!response.ok) {
                    console.error(`Error fetching suggestions. Status: ${response.status}, ${response.statusText}`);

                    return;
                }

                const data = await response.json();
                const sortedData = data.sort((a, b) => a.time - b.time);
                // const sortedData = data.sort((a, b) => a.name.localeCompare(b.name)); // Sort data alphabetically by 'name' field
                dispatch({
                    type: 'SET_ITEM',
                    collection: "galleries",
                    payload: sortedData,
                });
                setLoading(false)

                // setFacultyLoading(false);

            } catch (error) {
                console.error('An error occurred while fetching data:', error);
            } finally {
                // Set loading to false once the data is fetched (success or error)
            }
        };
        fetchData();
    }, [api, dispatch]);

    const filteredData = galleries.filter((image) => {
        const searchRegex = new RegExp(searchTerm, 'i');
        return (
            (searchRegex.test(image.folderName) || searchRegex.test(image.arabicFolderName))
        );
    });

    const GalleryCard = ({ folder }) => {
        return (
            <div className="GalleryCard">

                <div className="GalleryImage">
                    <p className="GalleryNo">{folder.time}</p>
                    <img src={folder.folderImage} alt="" />
                </div>
                {folder.folderLink === "Coming Soon" ? (
                    <div className="GalleryText">
                        {/* <h3> <Icon className='GalleryIcon' icon={folder.icon} />
                            {language == "ar" ? folder.arabicFolderName : folder.folderName}
                        </h3> */}
                        <h3 className="ComingSoon">
                            {languageText.handbook2}
                        </h3>
                    </div>
                ) : (
                    <div className="GalleryText">

                        <h3> <Icon className='GalleryIcon' icon={folder.icon} />
                            {language == "ar" ? folder.arabicFolderName : folder.folderName}
                        </h3>

                        <button onClick={() => { window.open(folder.folderLink, "_blank") }}><Icon icon="ion:folder" /></button>
                    </div>
                )

                }

            </div>
        )
    }

    return (
        <div className="Gallery">
            <h2>{languageText.gallery}</h2>

            <div className="LibraryContainer">
                <div className="SearchBarContainer">

                    <div className="SearchBar">
                        <button>
                            <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
                                <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" stroke-width="1.333" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </button>
                        <input className="SearchInput" placeholder="Type the Event Name"
                            required
                            type="text"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="SearchReset" type="reset">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>


            <div class="GalleryContainer">

                {filteredData.map((folder) => (
                    <GalleryCard folder={folder} key={folder._id} />
                ))}


            </div>
        </div>
    )
}

export default Gallery
