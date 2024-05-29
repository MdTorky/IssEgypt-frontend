import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MegaImages = ({ api }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(`${api}/api/mega/images`); // Fixed API URL interpolation
                setImages(response.data);
            } catch (error) {
                console.error('Error fetching images:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [api]); // Added 'api' as a dependency for useEffect

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ marginBottom: "90%" }}>
            <h1>MEGA Images</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {/* {images.map((image, index) => (
                    <div key={index} style={{ margin: '10px' }}>
                        <img src={image.url} alt={image.name} style={{ width: '200px', height: 'auto' }} />

                        <a href={image.url}>a</a>
                    </div>
                ))} */}
                {/* <img src="https://terabox.com/s/1Mb_Anc0h0GXjPuOkHMWeYw" alt="" /> */}
                {/* <button onClick={() => { window.open("https://terabox.com/s/1XSFb5g4UqgxxeXZh_0qBKg", "_blank") }}>Link</button> */}
            </div>
        </div>
    );
};

export default MegaImages;
