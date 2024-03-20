import React, { useEffect } from "react";
import './Bag.scss';
import SliderSingelNOBG from '../../Images/SliderSingelNOBG.png'
import { useLocation } from "react-router-dom";

export default function Bag({ bag, items, navigate, setShowBag }) {

    const location = useLocation()

    useEffect(() => {
        (async () => {
            // console.log(bag.length)
        })()
    }, []);
    return (
        <div className="Bag">
            <div className="BagList" style={location.pathname == "/products/slide" ? { "backgroundColor": "black" } : { "backgroundColor": "white" }}>
                <div className="BagListHeader">
                    <h1 style={location.pathname == "/products/slide" ? { "color": "white" } : { "color": "black" }}>Bag</h1>
                    {bag && !bag.length ?
                        <h2 onClick={() => {
                            setShowBag(false)
                            navigate('/products/slide')
                        }}>Explore products</h2>
                        :
                        <h2 onClick={() => {
                            setShowBag(false)
                            navigate('/cart')
                        }}>Review Bag</h2>
                    }

                </div>
                <div className="BagListItems">
                    {bag && !bag.length  ?
                        <div className="BagListItemsEmpty">
                            <h1 style={location.pathname == "/products/slide" ? { "color": "white" } : { "color": "black" }}>Your bag is empty.</h1>
                        </div>
                        : null}

                    {/* List */}
                    <div className="BagListItemsMain">
                        <div className="BagListItemsMainList">
                            {bag && bag.slice(0, 3).map((a, Index) =>
                                <div className="BagListItemsBox">
                                    {/* {console.log(Index)} */}
                                    <img
                                        onClick={() => {
                                            navigate(`store/slide?id=${a.Id}&v=${a.Version}&c=${a.Color}`)
                                            setShowBag(false)
                                        }}
                                        src={items.find(a => a.Id == bag[Index].Id).Versions.find(a1 => a1.Version == bag[Index].Version).Colors.find(a2 => a2.ColorId == bag[Index].Color).Image}
                                        alt=""
                                    />
                                    <span>
                                        <h1
                                            onClick={() => {
                                                navigate(`store/slide?id=${a.Id}&v=${a.Version}&c=${a.Color}`)
                                                setShowBag(false)
                                                console.log(a)
                                            }}
                                            style={location.pathname == "/products/slide" ? { "color": "white" } : { "color": "black" }}>
                                            {
                                                items.find(a => a.Id == bag[Index].Id).Name + ' ' +
                                                items.find(a => a.Id == bag[Index].Id).Versions.find(a1 => a1.Version == bag[Index].Version).Version + ' - ' +
                                                items.find(a => a.Id == bag[Index].Id).Versions.find(a1 => a1.Version == bag[Index].Version).Colors.find(a2 => a2.ColorId == bag[Index].Color).Color
                                            }
                                        </h1>
                                        <h2 style={location.pathname == "/products/slide" ? { "color": "white" } : { "color": "black" }}>X{bag[Index].Qty}</h2>
                                    </span>
                                </div>
                            )}
                        </div>

                        {bag && bag.length > 3 ?
                            <span>

                                <h3 style={location.pathname == "/products/slide" ? { "color": "white" } : { "color": "black" }}
                                    onClick={() => {
                                        setShowBag(false)
                                        navigate('/cart')
                                    }}>+ More items in your bag</h3>
                                <div className="BagListItemsMainEmpty">
                                    <h2 onClick={() => {
                                        setShowBag(false)
                                        navigate('/products/slide')
                                    }}>Continue shopping.</h2>
                                </div>
                            </span>
                            :       <div className="BagListItemsMainEmpty">
                            <h2 onClick={() => {
                                setShowBag(false)
                                navigate('/products/slide')
                            }}>Continue shopping.</h2>
                        </div>
                        }
                    </div>


                </div>
            </div>

            <div className="BagShadow" onClick={() => setShowBag(false)}></div>
        </div>
    )
}

