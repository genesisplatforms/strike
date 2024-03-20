import { Navigate, useNavigate } from 'react-router-dom';
import './App.scss';
import Main from './Main';
import Menu from '../Tools/Menu/Menu';
import Header from '../Tools/Header/Header';
import { useEffect, useState } from 'react';
import Bag from '../Store/Bag/Bag';
import axios from 'axios';

// Images
import SliderSingelNOBG from '../Images/SliderSingelNOBG.png'
import B433 from '../Images/Items/BiometricBlack/1B433.png'
import B434 from '../Images/Items/BiometricBlack/1B434.png'
import B435 from '../Images/Items/BiometricBlack/1B435.png'
import B436 from '../Images/Items/BiometricBlack/1B436.png'
import B438 from '../Images/Items/BiometricBlack/1B438.png'
import B439 from '../Images/Items/BiometricBlack/1B439.png'
import box435 from '../Images/Items/BiometricBlack/box435.png'
import box436 from '../Images/Items/BiometricBlack/box436.png'

import W426 from '../Images/Items/BiometricWhite/1W426.png'
import W428 from '../Images/Items/BiometricWhite/1W428.png'
import W429 from '../Images/Items/BiometricWhite/1W429.png'
import W431 from '../Images/Items/BiometricWhite/1W431.png'
import W432 from '../Images/Items/BiometricWhite/1W432.png'
import W433 from '../Images/Items/BiometricWhite/1W433.png'
import box434 from '../Images/Items/BiometricWhite/box434.png'
import box433 from '../Images/Items/BiometricWhite/box433.png'


function App() {
  const [showMenu, setShowMenu] = useState(false)
  const [showBag, setShowBag] = useState(false)
  const navigate = useNavigate()

  const [items, setItems] = useState([

    {
      Id: 1,
      Category: "Slide",
      Name: "Biometric Slide Safe",
      Versions: [
        {
          Version: 10,
          Colors: [
            {
              Color: "Black",
              ColorId: "black",
              Price: 199.00,
              Image: B433,
              Images: [B433, B434, B435, B436, B438, B439, box435, box436]
            },
            {
              Color: "White",
              ColorId: "white",
              Price: 199.00,
              Image: W426,
              Images: [W426, W428, W429, W431, W432, W433, box434, box433]
            }
          ]
        }
      ],
    },
  ])
  const [bag, setBag] = useState([
    {
      "Id": "1",
      "Version": "10",
      "Color": "black",
      "Qty": 3
    }
  ])
  const [bagChange, setBagChange] = useState(false)

  const loc = window.location;
  axios.defaults.baseURL = `${loc.protocol}//${loc.hostname === 'localhost' ? ':8080' : ''}`

  useEffect(() => {
    (async () => {
      console.log(bag)
      // localStorage.setItem("Bag", JSON.stringify(bag));
      const LocalBag = JSON.parse(localStorage.getItem("Bag"))
      setBag(LocalBag ? LocalBag : [])
    })()
  }, [bagChange]);

  return (
    <div className="App">
      {/* Menu */}
      {showMenu ? <Menu
        navigate={navigate}
        setShowMenu={setShowMenu} /> : null}
      {/* Bag */}
      {showBag ? <Bag
        items={items}
        bag={bag}
        navigate={navigate}
        setShowBag={setShowBag} /> : null}
      {/* Header */}
      {<Header
        bag={bag}
        showMenu={showMenu}
        navigate={navigate}
        setShowMenu={setShowMenu}
        setShowBag={setShowBag} />}

      {/* Main */}
      <Main
        items={items}
        bag={bag}
        setBag={setBag}
        setBagChange={setBagChange}
        setShowBag={setShowBag}
        navigate={navigate}
      />
    </div>
  );
}

export default App;
