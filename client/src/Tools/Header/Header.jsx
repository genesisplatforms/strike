import React, { useState } from 'react'
import leftMenu from '../../Images/Icons/leftMenu.png'
import next from '../../Images/Icons/next.png'
import closeMenu from '../../Images/Icons/closeMenu.png'
import ShopingBag from '../../Images/Icons/ShopingBag.png'
import LogoHeaderWhite from '../../Images/LogoHeaderWhite.png'
import LogoHeaderBlack from '../../Images/LogoHeaderBlack.png'
import './Header.scss';
import { useLocation } from "react-router-dom";

export default function Header({ bag, showMenu, setShowMenu, navigate, setShowBag }) {
    const [OpenFirstMenu, setOpenFirstMenu] = useState(false);
    const [header, setHeader] = useState(false)
    const [header2, setHeader2] = useState(false)

    const location = useLocation()

    return (
        <div className="Header"
            style={location.pathname == "/products/slide" ? { "backgroundColor": "black" } : { "backgroundColor": "white" }}
        >
            <div className='Header1' onClick={() => navigate("/products/slide")}>
                <img style={location.pathname == "/products/slide" ? { "filter": "invert(1)" } : { "filter": "invert(0)" }} src={LogoHeaderWhite} alt="" />
            </div>

            <div className='Header3'>

                {/* ShopingBag */}
                <div className="Header3ShopingBag" onClick={() => setShowBag(true)}>
                    <img style={location.pathname == "/products/slide" ? { "filter": "invert(1)" } : { "filter": "invert(0)" }} className='ShopingBag' src={ShopingBag} alt="" />
                    {bag && bag.length ?
                        <div style={location.pathname == "/products/slide" ? { "backgroundColor": "white" } : { "backgroundColor": "black" }} className="Header3ShopingBagAmount">
                            <h1 style={location.pathname == "/products/slide" ? { "color": "black" } : { "color": "white" }}>{bag && bag.length}</h1>
                        </div>
                        : null}
                </div>

                {/* showMenu */}
                {showMenu ?
                    <img style={location.pathname == "/products/slide" ? { "filter": "invert(1)" } : { "filter": "invert(0)" }} className='menuBar'
                        src={closeMenu} alt=""
                        onClick={() => setShowMenu(false)}
                    />
                    :
                    <img style={location.pathname == "/products/slide" ? { "filter": "invert(1)" } : { "filter": "invert(0)" }} className='menuBar'
                        src={leftMenu} alt=""
                        onClick={() => setShowMenu(true)}
                    />
                }

            </div>
        </div>
    )
}
