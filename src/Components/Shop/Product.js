import React from 'react'
import './Shop.css'
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFormsContext } from '../../hooks/useFormContext';
import Loader from "../Loader/Loader";


const Product = ({ api, language, languageText, darkMode }) => {


    const [size, setSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [sizeError, setSizeError] = useState("");
    const [loading, setLoading] = useState(false);
    const { products, dispatch } = useFormsContext();
    const { productId } = useParams();
    const [product, setProduct] = useState({});
    // const [price, setPrice] = useState(1);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${api}/api/product/${productId}`);
                if (!response.ok) {
                    console.error(
                        `Error fetching suggestions. Status: ${response.status}, ${response.statusText}`
                    );
                    return;
                }

                const data = await response.json();

                dispatch({
                    type: "GET_ITEM",
                    collection: "products",
                    payload: data,
                });
                setProduct(data)
                setLoading(false);
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }
        };
        fetchData();
        setSize(null);
        setQuantity(1);
        setSizeError("");
        localStorage.removeItem('selectedSize');
        localStorage.setItem('selectedPrice', 30);
        localStorage.setItem('selectedQuantity', 1);
    }, [api, dispatch, productId]);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${api}/api/product/`);
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


    const recommendations = product ? products
        .filter(product =>
            product.pCategory &&
            product.pCategory.length > 0 &&
            product.pCategory.some(category => product.pCategory.includes(category)) &&
            product._id !== productId &&
            product.pStatus === "Active"
        )
        .slice(0, 6)
        : [];

    const ProductCard = ({ product }) => {
        return (
            <Link to={`/product/${product._id}`} >
                <div className="ShopCard">
                    <img src={product.pImage} alt="" />
                    <div className="ShopCardNamePrice">
                        <p>{language === "en" ? product.pTitle : product.pArabicTitle}</p>
                        <p>{product.pPrice} {languageText.RM}</p>
                    </div>
                    {/* <div className="ShopCardDesc"> */}
                    {/* <p>Description</p> */}
                    {/* <button><Icon icon="solar:cart-check-broken" />{languageText.Purchase}</button> */}
                    {/* </div> */}
                </div>
            </Link>
        )
    }

    const handlePurchase = (e) => {
        e.preventDefault();
        if (!size) {
            setSizeError(languageText.PleaseSelectSize)
        }
        else {
            window.location.href = `/purchase/${product._id}`;
        }
    }

    const handleSizeChange = (e) => {
        const selectedSize = e.target.value;
        setSize(selectedSize);
        localStorage.setItem('selectedSize', selectedSize); // Save the size to localStorage
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            const updatedQuantity = quantity - 1;  // Calculate the new quantity first
            setQuantity(updatedQuantity);  // Update the state with the new quantity
            product.pPrice = (product.pPrice * updatedQuantity / quantity);  // Use updated quantity here
            // localStorage.setItem('selectedPrice', product.pPrice);  // Save updated price
            localStorage.setItem('selectedQuantity', updatedQuantity);  // Save updated quantity
        }
    };

    const incrementQuantity = () => {
        if (quantity < 5) {
            const updatedQuantity = quantity + 1;  // Calculate the new quantity first
            setQuantity(updatedQuantity);  // Update the state with the new quantity
            // product.pPrice = (product.pPrice * updatedQuantity / quantity).toFixed(2);  // Use updated quantity here
            product.pPrice = (product.pPrice * updatedQuantity / quantity);  // Use updated quantity here
            // localStorage.setItem('selectedPrice', product.pPrice);  // Save updated price
            localStorage.setItem('selectedQuantity', updatedQuantity);  // Save updated quantity
        }
    };


    // useEffect(() => {



    // }, []);
    const handleShare = async () => {
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

    return (
        <div className="Shop">
            {loading ? (
                <div>
                    <Loader />
                </div>
            ) : (
                <div className="Product">
                    <div>
                        <div className="ProductImg">
                            <img src={product.pImage} alt="" />
                        </div>

                    </div>


                    {/* Details Side */}
                    <div className="ProductDetails">
                        <div className="ProductTitle">
                            <div>
                                <h1>{language === "en" ? product.pTitle : product.pArabicTitle}</h1>
                                <p>{language === "en" ? product.pDescription : product.pArabicDescription}</p>

                            </div>
                            <p className="ShopPrice">{product.pPrice} {languageText.RM}</p>
                        </div>




                        {/* Size */}
                        <div className='ProductSize'>
                            <p >{languageText.Size} <span>- {size}</span></p>
                            <div className="ProductSizes">
                                {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                                    <label key={s}>
                                        <input
                                            className="Size"
                                            type="radio"
                                            name="engine"
                                            value={s}
                                            onChange={handleSizeChange} // Use the new handler
                                        />
                                        <span className="SizeTitle">
                                            <span className="SizeIcon">
                                                <span className="SizeLabel">{s}</span>
                                            </span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <Link to="/" className="SizeGuide">{languageText.SizeGuide}</Link>
                        </div>
                        {sizeError && !size && <p className="SizeError">{sizeError}</p>} {/* Display error message */}


                        <div className='ProductQuantity'>
                            <button onClick={decrementQuantity}>-</button>
                            <h3>{quantity}</h3>
                            <button onClick={incrementQuantity}>+</button>
                        </div>


                        <div className='ProductPurchase'>
                            <Link
                                // to={`/purchase/${product._id}`}
                                onClick={handlePurchase}
                                className='PurchaseButton'
                            // onClick={handleAddToCart}
                            >
                                <Icon icon="heroicons:shopping-bag" />
                                <p >{languageText.Purchase}</p>
                            </Link>
                            <button className="ProductShareButton" onClick={handleShare}>
                                <Icon icon="fluent:share-16-filled" />
                            </button>
                        </div>


                        <div className="Recommendation">
                            <p>{languageText.Recommendations}</p>
                            {recommendations.map(product => (
                                <ProductCard key={product._id} edit={false} product={product} languageText={languageText} api={api} />
                            ))}
                            {recommendations.length <= 0 &&
                                <div className="NoRecommendations">
                                    <p><Icon icon="ant-design:dislike-twotone" />{languageText.NoRecommendations}</p>
                                </div>
                            }
                        </div>


                    </div>
                </div>
            )}
        </div>
    )
}

export default Product
