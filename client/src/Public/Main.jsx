import React from 'react'
import { Route, Router, Routes } from 'react-router-dom'

import HomePage from '../Components/HomePage/HomePage'
import Slider1 from '../Components/Products/Slider1/Slider1'
import ProductPage from '../Store/ProductPage/ProductPage'
import Cart from '../Store/Cart/Cart'
import CheckOut from '../Store/CheckOut/CheckOut'

export default function Main({ bag, setBag, setBagChange, items, setShowBag, navigate }) {
    return (
        <Routes>
            <Route path="/" element={<HomePage navigate={navigate} />} />
            {/* Products */}
            <Route path="/products/slide" element={<Slider1 navigate={navigate} />} />
            <Route path="/store/slide" element={<ProductPage items={items} bag={bag} setBag={setBag} setBagChange={setBagChange} navigate={navigate} />} />
            <Route path="/cart" element={<Cart setShowBag={setShowBag} items={items} bag={bag} setBagChange={setBagChange} setBag={setBag} navigate={navigate} />} />
            <Route path="/checkout" element={<CheckOut setShowBag={setShowBag} items={items} bag={bag} setBag={setBag} navigate={navigate} />} />
        </Routes>
    )
}
