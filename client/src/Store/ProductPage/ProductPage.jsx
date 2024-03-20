import React, { useEffect, useState } from "react";
import './ProductPage.scss';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import ProductPageLight from "./ProductPageLight/ProductPageLight";
import SAFEWEBBLACK from '../../Images/Items/BiometricBlack/SAFEWEBBLACK.gltf'

// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// import { Stats, OrbitControls, Circle } from '@react-three/drei'
// import { Canvas, useLoader } from '@react-three/fiber'
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'




export default function ProductPage({ items, bag, setBag, setBagChange, navigate }) {
    const [ProductPageLightBox, setProductPageLightBox] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    // Router
    const location = useLocation().pathname
    const locationQurey = useLocation().search

    useEffect(() => {
        (async () => {
        })()
    }, []);


    return (
        <div className="ProductPage">
            <div className="ProductPageHeaderTopTop">
                <h1>{items[0].Name + ' ' + items[0].Versions[0].Version}</h1>
                <h2>From ${(items[0].Versions[0].Colors[0].Price).toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</h2>
            </div>
            <div className="ProductPageHeader">
                <div className="ProductPageHeaderTop">
                    <div className="ProductPageHeaderTopBototom">
                        <h3>3 Days delivery</h3>
                        <h3>Free Shipping</h3>
                        <h3>Pick up</h3>
                    </div>
                </div>
                <div className="ProductPageHeaderBottom">
                    <h1>Buy {items[0].Name + ' ' + items[0].Versions[0].Version}</h1>
                    <h2>From ${(items[0].Versions[0].Colors[0].Price).toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</h2>
                </div>
            </div>

            <div className="ProductPageLoader">

            </div>




            <div className="ProductPageProduct">
                <div className="ProductPageProductLeft">
                    <div className="ProductPageProductLeftTop">
                        <img onClick={() => setProductPageLightBox(true)} src={searchParams.get("c") == "black" ? items[0].Versions[0].Colors[0].Image : items[0].Versions[0].Colors[1].Image} alt="" />
                    </div>
                    <div className="ProductPageProductLeftBottom">
                        {searchParams.get("c") == "black" ?
                            items[0].Versions[0].Colors[0].Images.map((A, index) => <img onClick={() => setProductPageLightBox(true)} src={A} alt="" />)
                            :
                            items[0].Versions[0].Colors[1].Images.map((A, index) => <img onClick={() => setProductPageLightBox(true)} src={A} alt="" />)
                        }

                    </div>
                </div>
                <div className="ProductPageProductRight">
                    <div className="ProductPageProductRightInfo">
                        <h1><span>Model. </span> Choose your size and display.</h1>
                        <div className="ProductPageProductRightInfoBox">
                            <h2>{items[0].Name + ' ' + items[0].Versions[0].Version}</h2>
                            <h3>Liquid Retina display</h3>
                        </div>
                    </div>
                    <div className="ProductPageProductRightColor">
                        <div className="ProductPageProductRightColorHeader">
                            <h1><span>Finish. </span> Pick your favorite color.</h1>
                        </div>
                        <div className="ProductPageProductRightColors">
                            <div className="ProductPageProductRightColorsBox"
                                onClick={() => navigate(location + "?id=1&v=10&c=black")}
                                style={searchParams.get("c") == "black" ? { "border": "1px solid #007bff" } : { "border": "1px solid #e2e2e2" }}
                            >
                                <div className="ProductPageProductRightColorsBoxColor"></div>
                                <h3>Black</h3>
                            </div>
                            <div className="ProductPageProductRightColorsBox"
                                onClick={() => navigate(location + "?id=1&v=10&c=white")}
                                style={searchParams.get("c") == "white" ? { "border": "1px solid #007bff" } : { "border": "1px solid #e2e2e2" }}
                            >
                                <div className="ProductPageProductRightColorsBoxColor"></div>
                                <h3>White</h3>
                            </div>
                        </div>
                    </div>
                    <div className="ProductPageProductRightPaymentOption">
                        <h4>Payment</h4>
                        <div className="ProductPageProductRightPaymentOptionBox">
                            <h2>${(items[0].Versions[0].Colors[0].Price).toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</h2>
                            <h3>We accept all major credit cards.</h3>
                        </div>
                        <div className="ProductPageProductRightPaymentOptionFinal">
                            <h2>{items[0].Name + ' ' + items[0].Versions[0].Version} - {searchParams.get("c") == "black" ? items[0].Versions[0].Colors[0].Color : items[0].Versions[0].Colors[1].Color}</h2>
                            <h3>Order now. Get delivery in the next 7 Days</h3>
                        </div>
                        {/* Add to Bag */}
                        <h1
                            onClick={() => {
                                // setBag(bag => [...bag, {
                                //     Id: searchParams.get("id"),
                                //     Version: searchParams.get("v"),
                                //     Color: searchParams.get("c"),
                                //     Qty: 1
                                // }])
                                bag.push({
                                    Id: searchParams.get("id"),
                                    Version: searchParams.get("v"),
                                    Color: searchParams.get("c"),
                                    Qty: 1
                                })
                                localStorage.setItem("Bag", JSON.stringify(bag));
                                navigate('/cart')
                                setBagChange(a => !a)
                            }}
                        >Add to Bag</h1>
                    </div>
                    <div className="ProductPageProductRightDetails">
                        <h2>DESCRIPTION</h2>
                        <h2>SPECIFICATION</h2>
                        <h2>INCLUDED ACCESSORIES</h2>
                    </div>
                </div>
            </div>

            {ProductPageLightBox ?
                <ProductPageLight setProductPageLightBox={setProductPageLightBox} items={items} navigate={navigate} location={location} />
                : null}


        </div >
    )
}

