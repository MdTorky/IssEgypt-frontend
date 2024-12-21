import { useState, useEffect } from "react";
import Loader from "../Loader/Loader";

import './Shop.css'
import logo from '../../images/HorusToken.png'
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { useFormsContext } from '../../hooks/useFormContext';

const Shop = ({ languageText, api, darkMode, language }) => {

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
                // const sortedData = data.sort((a, b) => a.lecturerName.localeCompare(b.lecturerName)); // Sort data alphabetically by 'name' field

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

    const ShopCard = ({ product }) => {
        return (
            <Link to={`/product/${product._id}`} >
                <div className="ShopCard">
                    <img src={product.pImage} alt="" />
                    <div className="ShopCardNamePrice">
                        <p>{language === "en" ? product.pTitle : product.pArabicTitle}</p>
                        <p>{product.pPrice} {languageText.RM}</p>
                    </div>
                    {/* <div className="ShopCardDesc">
                        <button><Icon icon="solar:cart-check-broken" />{languageText.Purchase}</button>
                    </div> */}
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
