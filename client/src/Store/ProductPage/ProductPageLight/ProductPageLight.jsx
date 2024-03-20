import React, { useState } from 'react'
import './ProductPageLight.scss'
import info from '../../../Images/Icons/info.png'
import Arrow2 from '../../../Images/Icons/Arrow2.svg'
import closeMenu from '../../../Images/Icons/closeMenu.png'

// Gallery
import "react-image-gallery/styles/scss/image-gallery.scss";
import "react-image-gallery/styles/css/image-gallery.css";
import "react-image-gallery/styles/css/image-gallery.css";


import ImageGallery from 'react-image-gallery';
import { useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

export default function ProductPageLight({setProductPageLightBox,  items, navigate }) {
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams();

    const [indexPhoto, setindexPhoto] = useState(new URLSearchParams(useLocation().search).get("index"));
    const images = [
        Object.values(searchParams.get("c") == "black" ? items[0].Versions[0].Colors[0].Images : items[0].Versions[0].Colors[1].Images).map((a, r, index) => (
            Object(
                {
                    original: a,
                    thumbnail: a,
                }
            )

        ))
    ]
    const slideshowref = useRef()
    const playSlides = () => {
        setindexPhoto(slideshowref.current.getCurrentIndex())
        return slideshowref.current.getCurrentIndex()
    }
    return (
        <div className="ProductPageLight">
            <div className="ProductPageLightTop">
                <img src={closeMenu} alt="" onClick={() => {
                    setProductPageLightBox(false)
                    // navigate(location.pathname + `?pathid=${new URLSearchParams(location.search).get("pathid")}`)
                }} />
                <img src={Arrow2} alt="" onClick={() => {
                    setProductPageLightBox(false)
                    // navigate(location.pathname+ `?pathid=${new URLSearchParams(location.search).get("pathid")}`  + '&gallery=yes')
                }} />
            </div>
            <div className="CarsPageHeader">
                <div className="CarsPageHeader1">
                    {/* <h1>{items.FullName}</h1> */}
                </div>
                <div className="CarsPageHeader2">
                    {/* <div className="CarsPageHeader2Box">
                        <h2>Save</h2>
                        <img src={info} alt="" />
                    </div> */}
                    <div className="CarsPageHeader2Box">
                        {/* <h2>Share</h2> */}
                        {/* <img src={info} alt="" /> */}
                    </div>
                </div>
            </div>
            <div className="ProductPageLightGallery">
                <ImageGallery
                    ref={slideshowref}
                    showIndex={true}
                    items={images[0]}
                    startIndex={Number(indexPhoto)}
                    onSlide={() => {
                        // navigate(location.pathname + `?pathid=${new URLSearchParams(location.search).get("pathid")}` + `&gallerylight=yes&index=${playSlides()}`)
                    }}
                    showPlayButton={false}
                />
            </div>
            
        </div>
    )
}

