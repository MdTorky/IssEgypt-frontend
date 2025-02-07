import { useState, useEffect } from "react";
import Loader from "../Loader/Loader";
import './Shop.css'
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { useFormsContext } from '../../hooks/useFormContext';

const Shop = ({ languageText, api, language }) => {

    const [loading, setLoading] = useState(false);
    const { products, dispatch } = useFormsContext();



    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${api}/api/product`);
                if (!response.ok) {
                    console.error(
                        `Error fetching suggestions. Status: ${response.status}, ${response.statusText}`
                    );
                    return;
                }

                const data = await response.json();
                dispatch({
                    type: "SET_ITEM",
                    collection: "products",
                    payload: data,
                });
                setLoading(false);
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }
        };
        fetchData();
    }, [api, dispatch]);

    const handleShare = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Check this ISS EGYPT Product Out!",
                    text: "Have a look at this amazing product!",
                    url: window.location.href, // Current page URL
                });
                console.log("Content shared successfully!");
            } catch (error) {
                console.error("Error sharing content:", error);
            }
        } else {
            alert("Web Share API not supported in your browser.");
        }
    };

    const ShopCard = ({ product }) => {
        return (
            <Link to={`/product/${product._id}`} >
                <div className="ShopCard">
                    <img src={product.pImage} alt="" />
                    <div className="ShopCardNamePrice">
                        <p>{language === "en" ? product.pTitle : product.pArabicTitle}</p>
                    </div>
                    <div className="ShopCardDesc">
                        <p >{product.pDescription}</p>
                    </div>
                    <div className="ShopCardPriceDetails">
                        <p>{product.pPrice} {languageText.RM}</p>
                        <div className="ShopCardButtons">
                            <button> <Icon icon="material-symbols:3d-rotation" className="ShopCardIcon" onClick={(e) => { e.stopPropagation(); e.preventDefault(); window.open(product.pModel, "_blank") }} /></button>
                            <button> <Icon icon="fluent:share-16-filled" className="ShopCardIcon" onClick={(e) => handleShare(e)} /></button>
                        </div>
                    </div>
                </div>
            </Link>
        )
    }


    return (
        <div className="Shop">
            <h2>{languageText.ISSShop}</h2>
            {loading ? (
                <div>
                    <Loader />
                </div>
            ) : (
                <div className="ShopItems">
                    {products.map((product) => (
                        <>
                            <ShopCard product={product} />
                        </>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Shop
