import React, { useEffect, useState } from "react";
import './Cart.scss';
import SliderSingelNOBG from '../../Images/SliderSingelNOBG.png'
import cartEmpty from '../../Images/Icons/cartEmpty.png'

export default function Cart({ bag, setBag, setBagChange, items, navigate, setShowBag }) {
    const [subTotal, setSubTotal] = useState(0);

    useEffect(() => {
        (async () => {
            const sum = []
            for (let index = 0; index < bag.length; index++) {
                sum.push((items.find(a => a.Id == bag[index].Id).Versions.find(a1 => a1.Version == bag[index].Version).Colors.find(a2 => a2.ColorId == bag[index].Color).Price * bag[index].Qty))
            }
            setSubTotal(sum.reduce((partialSum, a) => partialSum + a, 0))
        })()
    }, [bag]);
    return (
        <div className="Cart">
            <div className="CartListHeader">
                <h1>
                    Review your bag
                    <span>Free delivery and free returns.</span>
                </h1>
                <h2
                    style={bag && bag.length ? { "backgroundColor": "#007bff" } : { "backgroundColor": "#aeaeae" }}
                    onClick={() => bag && bag.length ? navigate('/checkout?p=billing') : null}>
                    Check Out
                </h2>
            </div>
            <div className="CartList">
                <h3 onClick={() => {
                    setShowBag(false)
                    navigate('/products/slide')
                }}>Continue shopping.</h3>
                <div className="CartListItems">
                    {bag && bag.map((a, Index) =>
                        <div className="CartListItemsBox">
                            {/* {console.log(Index)} */}
                            <div className="CartListItemsBoxLeft">
                                <img
                                    onClick={() => {
                                        navigate(`store/slide?id=${a.Id}&v=${a.Version}&c=${a.Color}`)
                                        setShowBag(false)
                                    }}
                                    src={items.find(a => a.Id == bag[Index].Id).Versions.find(a1 => a1.Version == bag[Index].Version).Colors.find(a2 => a2.ColorId == bag[Index].Color).Image} alt=""
                                />
                                <span>
                                    <h1
                                        onClick={() => {
                                            navigate(`store/slide?id=${a.Id}&v=${a.Version}&c=${a.Color}`)
                                            setShowBag(false)
                                        }}
                                    >
                                        {
                                            items.find(a => a.Id == bag[Index].Id).Name + ' ' +
                                            items.find(a => a.Id == bag[Index].Id).Versions.find(a1 => a1.Version == bag[Index].Version).Version + ' - ' +
                                            items.find(a => a.Id == bag[Index].Id).Versions.find(a1 => a1.Version == bag[Index].Version).Colors.find(a2 => a2.ColorId == bag[Index].Color).Color
                                        }
                                    </h1>
                                    <h2>X{bag[Index].Qty}</h2>
                                </span>
                            </div>
                            <div className="CartListItemsBoxRight">
                                <h2>
                                    ${(items.find(a => a.Id == bag[Index].Id).Versions.find(a1 => a1.Version == bag[Index].Version).Colors.find(a2 => a2.ColorId == bag[Index].Color).Price * bag[Index].Qty).toLocaleString("en", { minimumFractionDigits: 2 })}
                                    <span>
                                        ${(items.find(a => a.Id == bag[Index].Id).Versions.find(a1 => a1.Version == bag[Index].Version).Colors.find(a2 => a2.ColorId == bag[Index].Color).Price).toLocaleString("en", { minimumFractionDigits: 2 })}
                                    </span>
                                </h2>
                                <h3 onClick={() => {
                                    bag.splice(Index, 1);
                                    localStorage.setItem("Bag", JSON.stringify(bag));
                                    setBagChange(a => !a)
                                    // setBag(previousEmployeeData => previousEmployeeData.filter((data, index2) => index2 != Index))
                                }}>Remove</h3>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {bag && bag.length ?
                <div className="CartMainFinal">
                    <div className="CartListFinal">
                        <div className="CartListFinalSub">
                            <div className="CartListFinalLeft">
                                <h2>Subtotal</h2>
                                <h2>Shipping</h2>
                                <h2>Tax</h2>
                            </div>
                            <div className="CartListFinalRight">
                                <h2>${subTotal.toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</h2>
                                <h2>FREE</h2>
                                <h2>${(subTotal * 0.096).toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</h2>
                            </div>
                        </div>
                        <div className="CartListFinalTotal">
                            <h2>Total</h2>
                            <h2>${(subTotal + (subTotal * 0.096)).toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</h2>
                        </div>
                    </div>
                    <div className="CartListFinalCheckOut">
                        <div className="CartListFinalCheckOutBox">
                            <h3>Fast and Secure Checkout</h3>
                            <h2 onClick={() => navigate('/checkout?p=billing')}>Check Out</h2>
                        </div>
                    </div>
                </div>
                :
                <div className="CartEmpty">
                    <div className="CartEmptyMain"></div>
                    <img src={cartEmpty} alt="" />
                    <h1>No items found</h1>
                    <h2 onClick={() => navigate('/products/slide')}>Discover products</h2>
                </div>
            }
        </div>
    )
}

