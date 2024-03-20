import React from "react";
import ReactPlayer from 'react-player'
import './Slider1.scss';

import SliderVideo from '../../../Images/SliderVideo.MP4'
import SliderVideoInstall from '../../../Images/SliderVideoInstall.MP4'
import SliderBoxWhite from '../../../Images/SliderBoxWhite.JPG'
import SliderTest from '../../../Images/SliderTest.JPG'
import SliderBenefit from '../../../Images/SliderBenefit.JPG'
import SliderSingel from '../../../Images/SliderSingel.JPG'
import SliderSingelNOBG from '../../../Images/SliderSingelNOBG.png'
import Slider3DNOBG from '../../../Images/Slider3DNOBG.png'
import Slider3DNOBG_2 from '../../../Images/Slider3DNOBG_2.png'
import SliderBoxWhiteOnly from '../../../Images/SliderBoxWhiteOnlyPNG.png'

export default function Slider1({ navigate }) {


    return (
        <div className="Slider1">
            <div className="Slider1Header">
                <h1>Biometric Slide Safe 10</h1>
                <h2 onClick={() => navigate('store/slide?id=1&v=10&c=black')}>Buy</h2>
            </div>
            <div className="Slider1Top">
                <div className="Slider1TopVideo">
                    <div className="Slider1TopVideoGradiant"></div>



                    <ReactPlayer
                        className='react-player'
                        url={SliderVideo}
                        width='100%'
                        height='100%'
                        controls={false}
                        playing={true}
                        muted={true}
                        loop={true}
                        playsinline
                    />
                </div>
                <div className="Slider1TopBootom">
                    <h1>Astonishing performance. Incredibly advanced displays. Superfast wireless connectivity. Next-level Apple Pencil capabilities. Powerful new features in iPadOS. The ultimate iPad experience.</h1>
                    <h2>Watch the film Installation</h2>
                    <h3>Increased storage space and optic ready design allows for you to store your pistol with your ideal optic scenario.</h3>
                    <div className="Slider1TopBootomIMG">
                        <img src={SliderSingelNOBG} alt="" />
                        <img src={SliderSingelNOBG} alt="" />
                        <img src={SliderSingelNOBG} alt="" />
                    </div>
                    <h4><span>M2 chip.</span>The M2 chip is the next generation of Apple silicon, with an 8‑core CPU that delivers up to 15 percent faster performance and a 10‑core GPU that provides up to 35 percent faster graphics performance.1 With a 40 percent faster Neural Engine to accelerate machine learning tasks and 50 percent more memory bandwidth, M2 brings astonishing performance and new capabilities to iPad Pro. So you can create photorealistic 3D designs, build intricate AR models, and play games with console‑quality graphics at high frame rates faster than ever. All while enjoying all‑day battery life.2</h4>
                </div>
                <div className="Slider1TopBootomSlider1TopBootom1">
                    <h2>Wi-Fi Optional <span>Wifi</span></h2>
                    <h2>Bluetooth 2.0  <span>Bluetooth</span></h2>
                    <h2>Visible at Night. <span>Visible</span></h2>
                </div>
                <div className="Slider1TopBootomSlider1TopBootom">
                    <h1>
                        A complete movie studio in your hands.
                        <span>Now you can capture ProRes video using the image signal processor in M2 and advanced cameras on iPad Pro. Five studio‑quality microphones and four-speaker audio with support for Dolby Atmos let you record and deliver theater‑like sound. And with Final Cut Pro for iPad, you can capture in ProRes and get the highest video quality with amazing real-time performance for tasks like multistream editing.</span>
                    </h1>
                    <img src={Slider3DNOBG_2} alt="" />
                </div>
            </div>
            <div className="Slider1Installation">
                <h1>Rapid Deployment. Silent Action.</h1>
                <h2>Reliable security + high end technology.</h2>
                <div className="Slider1InstallationVideo">
                    {/* <video
                        muted
                        autoPlay
                        loop src={SliderVideoInstall}>
                    </video> */}

                    <ReactPlayer
                        url={SliderVideoInstall}
                        width='100%'
                        height='100%'
                        controls={true}
                        playing={true}
                        muted={true}
                        loop={true}
                        playsinline
                    />

                </div>
            </div>
            <div className="Slider1Banner">
                <div className="Slider1BannerTop">
                    <h1>
                        Magic Keyboard. <br />
                        Apple Pencil. <br />
                        Endless possibilities.
                        <h3>
                            <span>Pro accessories. </span>
                            Apple Pencil, Magic Keyboard, and the Smart Keyboard Folio open up even more ways to use iPad Pro. Draw a masterpiece, take notes, or knock out a business plan. These versatile accessories are designed to take your work and creativity to the next level.9
                        </h3>
                    </h1>
                    <h2>
                        Pro accessories.
                    </h2>
                </div>
                <div className="Slider1BanneBottom">
                    <img src={SliderBoxWhiteOnly} alt="" />
                </div>

            </div>
            {/* <div className="Slider1Benefit">
                <div className="Slider1BenefitHeader">
                    <h1>Powerful features. Intelligent Technology.</h1>
                    <h2>More capable than ever before. Store with optics, monitor from anywhere.</h2>
                </div>
                <div className="Slider1BenefitList">
                    <div className="Slider1BenefitBox">
                        <img src={SliderTest} alt="" />
                        <h2>Precision Rail System</h2>
                        <h3>Premium Entry Methods: Biometric Scanner, Numeric Keypad</h3>
                    </div>
                    <div className="Slider1BenefitBox">
                        <img src={SliderTest} alt="" />
                        <h2>Precision Rail System</h2>
                        <h3>Premium Entry Methods: Biometric Scanner, Numeric Keypad</h3>
                    </div>
                    <div className="Slider1BenefitBox">
                        <img src={SliderTest} alt="" />
                        <h2>Precision Rail System</h2>
                        <h3>Premium Entry Methods: Biometric Scanner, Numeric Keypad</h3>
                    </div>
                    <div className="Slider1BenefitBox">
                        <img src={SliderTest} alt="" />
                        <h2>Precision Rail System</h2>
                        <h3>Premium Entry Methods: Biometric Scanner, Numeric Keypad</h3>
                    </div>
                    <div className="Slider1BenefitBox">
                        <img src={SliderTest} alt="" />
                        <h2>Precision Rail System</h2>
                        <h3>Premium Entry Methods: Biometric Scanner, Numeric Keypad</h3>
                    </div>
                    <div className="Slider1BenefitBox">
                        <img src={SliderTest} alt="" />
                        <h2>Precision Rail System</h2>
                        <h3>Premium Entry Methods: Biometric Scanner, Numeric Keypad</h3>
                    </div>
                </div>
            </div> */}
        </div>
    )
}

