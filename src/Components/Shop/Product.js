import React from 'react'
import logo from '../../images/HorusToken.png'
import './Shop.css'
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const Product = () => {


    const [size, setSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState("black");


    const ShopCard = () => {
        return (
            <Link to="/product/:productId" >
                <div className="ShopCard">
                    <img src={logo} alt="" />
                    <div className="ShopCardNamePrice">
                        <p>Name</p>
                        <p>$123</p>
                    </div>
                    <div className="ShopCardDesc">
                        <button><Icon icon="solar:cart-check-broken" /> Purchase</button>

                    </div>
                </div>
            </Link>
        )
    }

    return (
        <div className="Shop">
            <div className="Product">
                <div>
                    <div className="ProductImg">
                        <img src={logo} alt="" />
                    </div>

                    {/* Shirt Carousel */}

                </div>


                {/* Details Side */}
                <div className="ProductDetails">
                    <div className="ProductTitle">
                        <div>
                            <h1>Polo Shirt</h1>
                            <p >Teixeira Design Studio</p>
                        </div>
                        <p className="ShopPrice">$12</p>
                    </div>




                    {/* Size */}
                    <div className='ProductSize'>
                        <p >Size <span>- {size}</span></p>
                        <div class="ProductSizes">
                            <label>
                                <input class="Size" type="radio" name="engine" value="XS" onChange={(e) => setSize(e.target.value)} />
                                <span class="SizeTitle">
                                    <span class="SizeIcon">
                                        <span class="SizeLabel">XS</span>
                                        {/* <Icon icon="fluent:share-16-filled" /> */}

                                    </span>
                                </span>
                            </label>
                            <label>
                                <input class="Size" type="radio" name="engine" value="S" onChange={(e) => setSize(e.target.value)} />
                                <span class="SizeTitle">
                                    <span class="SizeIcon">
                                        <span class="SizeLabel">S</span>
                                        {/* <Icon icon="fluent:share-16-filled" /> */}
                                    </span>
                                </span>
                            </label>
                            <label>
                                <input class="Size" type="radio" name="engine" value="M" onChange={(e) => setSize(e.target.value)} />
                                <span class="SizeTitle">
                                    <span class="SizeIcon">
                                        <span class="SizeLabel">M</span>
                                        {/* <Icon icon="fluent:share-16-filled" /> */}

                                    </span>
                                </span>
                            </label>
                            <label>
                                <input class="Size" type="radio" name="engine" value="L" onChange={(e) => setSize(e.target.value)} />
                                <span class="SizeTitle">
                                    <span class="SizeIcon">
                                        <span class="SizeLabel">L</span>

                                    </span>
                                </span>
                            </label>
                            <label>
                                <input class="Size" type="radio" name="engine" value="XL" onChange={(e) => setSize(e.target.value)} />
                                <span class="SizeTitle">
                                    <span class="SizeIcon">
                                        <span class="SizeLabel">XL</span>

                                    </span>
                                </span>
                            </label>
                            <label>
                                <input class="Size" type="radio" name="engine" value="XXL" onChange={(e) => setSize(e.target.value)} />
                                <span class="SizeTitle">
                                    <span class="SizeIcon">
                                        <span class="SizeLabel">XXL</span>

                                    </span>
                                </span>
                            </label>
                        </div>
                        <Link to="/" className="SizeGuide">Size Guide</Link>
                    </div>

                    {/* Quantity and Add To Cart */}

                    <div className='ProductPurchase'>
                        <Link
                            to="/purchase/432432"
                            // onClick={handleAddToCart}
                            className='PurchaseButton'
                        >
                            <Icon icon="heroicons:shopping-bag" />
                            <p >Purchase</p>
                        </Link>
                        <button className='ProductShareButton'>
                            <Icon icon="fluent:share-16-filled" />
                        </button>
                    </div>


                    <div className="Recommendation">
                        <p>Recommendation</p>
                        <ShopCard />
                    </div>


                </div>
            </div>
        </div>
    )
}

export default Product
