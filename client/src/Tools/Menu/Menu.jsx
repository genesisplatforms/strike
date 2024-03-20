import React, { useState } from 'react'
import closeMenu from '../../Images/Icons/closeMenu.png'
import next from '../../Images/Icons/next.png'
import tiktok from '../../Images/Icons/tiktok.png';
import facebook from '../../Images/Icons/facebook.png';
import instagram from '../../Images/Icons/instagram.png';
import './Menu.scss';

export default function Menu({ navigateTo, setShowMenu, WebSitePages }) {
    const [showCategories, setshowCategories] = useState(false);
    const [showMakers, setshowMakers] = useState(false);
    return (
        <div className="Menu">
            <div className="MenuBoxShadow" onClick={()=>setShowMenu(false)}></div>
            <div className="MenuList">
                <div className="MenuListTop">
                    <div className="MenuMain">
                        <div className="MenuMainBox">
                            <a href='/'>Home</a>
                        </div>
                        <div className="MenuMainBox" onClick={() => {
                            setshowMakers(true)
                        }}>
                            <h1 >Business Loans</h1>
                            <img src={next} alt="" />
                        </div>
                        <div className="MenuMainBox" onClick={() => {
                            setshowCategories(true)
                        }}>
                            <h1>Resources</h1>
                            <img src={next} alt="" />
                        </div>
                    </div>
                    <div className="MenuMain2">

                        <div className="MenuMainBox">
                            <a href='/contact'>Support</a>
                        </div>
                    </div>
                    <div className="MenuFooter">
                        <h5>Copyright © 2023 SENEER Capital. All rights reserved.</h5>
                    </div>

                    {/* showCategories */}
                    {showMakers ?
                        <div className="MenuMakers">
                            <div className="MenuMakersHeader">
                                <img src={next} alt="" onClick={() => {
                                    setshowMakers(false)
                                }} />
                                <h1 onClick={() => {
                                    // navigateTo("")
                                }}>Business Loans</h1>
                            </div>
                            <div className="MenuMakersList">
                                {WebSitePages.filter(a => a.Category == "Sulotion").map((A, index) =>
                                    <div className="MenuMakersListBox">
                                        <a key={index} href={`${A.Path}`}>{A.Name}</a>
                                    </div>
                                )}
                            </div>

                        </div>
                        : null}
                    {showCategories ?
                        <div className="MenuMakers">
                            <div className="MenuMakersHeader">
                                <img src={next} alt="" onClick={() => {
                                    setshowCategories(false)
                                }} />
                                <h1 onClick={() => {
                                    // navigateTo("")
                                }}>Resources</h1>
                            </div>
                            <div className="MenuMakersList">
                                {WebSitePages.filter(a => a.Category == "Resources").map((A, index) =>
                                    <div className="MenuMakersListBox">
                                        <a key={index} href={`${A.Path}`}>{A.Name}</a>
                                    </div>
                                )}
                            </div>

                        </div>
                        : null}
                </div>
                <div className="MenuListFooter">
                    <p>
                        Monday - Friday
                        <br />
                        9:30 a.m. - 7:30 p.m. EST
                    </p>
                    <a href="/apply">Apply Now</a>
                </div>

            </div>
        </div>
    )
}
