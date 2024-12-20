import React from 'react'
import './Shop.css'
import logo from '../../images/HorusToken.png'
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const Shop = ({ languageText }) => {



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
                        {/* <p>Description</p> */}
                        <button><Icon icon="solar:cart-check-broken" /> Purchase</button>
                    </div>
                </div>
            </Link>
        )
    }


    return (
        <div className="Shop">
            <h2>{languageText.ISSShop}</h2>

            <div className="ShopItems">
                <ShopCard />
                <ShopCard />
            </div>
        </div>
    )
}

export default Shop
