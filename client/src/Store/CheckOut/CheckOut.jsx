import React, { useEffect, useState } from "react";
import './CheckOut.scss';
import SliderSingelNOBG from '../../Images/SliderSingelNOBG.png'
import ExclamationMark from '../../Images/Icons/ExclamationMark.png'
import Arrow from '../../Images/Icons/Arrow.webp'
import CreditDetails from './CreditCard/CreditDetails'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

export default function CheckOut({ bag, setBag, items, navigate, setShowBag }) {
    const [subTotal, setSubTotal] = useState(0);
    const [ShowCart, setShowCart] = useState(false);
    const [ShowPage1, setShowPage1] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation()

    const [state, setState] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: '',
        focus: '',
    });


    useEffect(() => {
        (async () => {
            if (!JSON.parse(localStorage.getItem("Bag")).length) {
                return navigate('/products/slide') 
            }

            const sum = []
            for (let index = 0; index < bag.length; index++) {
                sum.push((items.find(a => a.Id == bag[index].Id).Versions.find(a1 => a1.Version == bag[index].Version).Colors.find(a2 => a2.ColorId == bag[index].Color).Price * bag[index].Qty))
            }
            setSubTotal(sum.reduce((partialSum, a) => partialSum + a, 0))
        })()
    }, [bag]);
    return (
        <div className="CheckOut">
            <div className="CheckOutListHeader">
                <div className="CheckOutListHeaderTop">
                    <h1>
                        Checkout
                    </h1>
                    <h2 onClick={() => setShowCart(a => !a)}>{ShowCart ? "Hide Order Summary" : "Show Order Summary"}: ${(subTotal + (subTotal * 0.096)).toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</h2>
                </div>
            </div>
            {ShowCart ?
                <div className="CheckOutList">
                    <div className="CheckOutListItems">
                        {bag.map((a, Index) =>
                            <div className="CheckOutListItemsBox">
                                {/* {console.log(Index)} */}
                                <div className="CheckOutListItemsBoxLeft">
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
                                <div className="CheckOutListItemsBoxRight">
                                    <h2>
                                        ${(items.find(a => a.Id == bag[Index].Id).Versions.find(a1 => a1.Version == bag[Index].Version).Colors.find(a2 => a2.ColorId == bag[Index].Color).Price * bag[Index].Qty).toLocaleString("en", { minimumFractionDigits: 2 })}
                                        <span>
                                            ${(items.find(a => a.Id == bag[Index].Id).Versions.find(a1 => a1.Version == bag[Index].Version).Colors.find(a2 => a2.ColorId == bag[Index].Color).Price).toLocaleString("en", { minimumFractionDigits: 2 })}
                                        </span>
                                    </h2>                                    
                                    {/* <h3 onClick={() => {
                                        setBag(previousEmployeeData => previousEmployeeData.filter((data, index2) => index2 != Index))
                                    }}>Remove</h3> */}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="CheckOutListFinal">
                        <div className="CheckOutListFinalSub">
                            <div className="CheckOutListFinalLeft">
                                <h2>Subtotal</h2>
                                <h2>Shipping</h2>
                                <h2>Tax</h2>
                            </div>
                            <div className="CheckOutListFinalRight">
                                <h2>${subTotal.toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</h2>
                                <h2>FREE</h2>
                                <h2>${(subTotal * 0.096).toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</h2>
                            </div>
                        </div>
                        <div className="CheckOutListFinalTotal">
                            <h2>Total</h2>
                            <h2>${(subTotal + (subTotal * 0.096)).toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</h2>
                        </div>
                    </div>
                </div>
                : null
            }
            <div className="CheckOutNavPath">
                <h3 onClick={() => navigate('/products/slide')}>Home</h3>
                <img src={Arrow} alt="" />
                <h3 onClick={() => navigate('/cart')}>Cart</h3>
                <img src={Arrow} alt="" />
                <h3 style={searchParams.get("p") == "billing" ? { "color": "#007bff" } : { "color": "black" }} onClick={() => navigate('/checkout?p=billing')}>Checkout</h3>
                <img src={Arrow} alt="" />
                <h3 style={searchParams.get("p") == "payment" ? { "color": "#007bff" } : { "color": "black" }}>Confirm Payment</h3>
            </div>

            {/* Page 1 Billing information */}
            {searchParams.get("p") == "billing" ?
                <div className="CheckOutBilling">
                    <div className="CheckOutBillingHeader">
                        <h1>Where should we send your order?</h1>
                    </div>
                    <div className="CheckOutBillingInputs">
                        <div className="CheckOutBillingInputsAddress">
                            <h1>Enter your name and address:</h1>
                            {/* First Name */}
                            <div className="CheckOutBillingInputsBox">
                                <input
                                    placeholder="First Name"
                                    type="text"
                                />
                                {null ?
                                    <span>
                                        <img src={ExclamationMark} alt="" />
                                        <p>Please enter a first name.</p>
                                    </span>
                                    :
                                    null
                                }
                            </div>
                            {/* Last Name */}
                            <div className="CheckOutBillingInputsBox">
                                <input
                                    placeholder="Last Name"
                                    type="text"
                                />
                                {null ?
                                    <span>
                                        <img src={ExclamationMark} alt="" />
                                        <p>Please enter a last name.</p>
                                    </span>
                                    :
                                    null
                                }
                            </div>
                            {/* Street Address */}
                            <div className="CheckOutBillingInputsBox">
                                <input
                                    placeholder="Street Address"
                                    type="text"
                                />
                                {null ?
                                    <span>
                                        <img src={ExclamationMark} alt="" />
                                        <p>Please enter a street address.</p>
                                    </span>
                                    :
                                    null
                                }
                            </div>
                            {/* Apt, Suite, Building (Optional) */}
                            <div className="CheckOutBillingInputsBox">
                                <input
                                    placeholder="Apt, Suite, Building (Optional)"
                                    type="text"
                                />
                                {null ?
                                    <span>
                                        <img src={ExclamationMark} alt="" />
                                        <p>Please enter a apt, suite, building (optional).</p>
                                    </span>
                                    :
                                    null
                                }
                            </div>
                            {/* Zipcode_City_State */}
                            <div className="CheckOutBillingInputsAddress_Zipcode_City">
                                {/* Zip Code */}
                                <div className="CheckOutBillingInputsBox">
                                    <input
                                        placeholder="Zip Code"
                                        type="number"
                                    />
                                    {null ?
                                        <span>
                                            <img src={ExclamationMark} alt="" />
                                            <p>Please enter a zip code.</p>
                                        </span>
                                        :
                                        null
                                    }
                                </div>
                                {/* City */}
                                <div className="CheckOutBillingInputsBox">
                                    <input
                                        placeholder="City"
                                        type="text"
                                    />
                                    {null ?
                                        <span>
                                            <img src={ExclamationMark} alt="" />
                                            <p>Please enter a city.</p>
                                        </span>
                                        :
                                        null
                                    }
                                </div>
                            </div>
                            {/* State */}
                            <div className="CheckOutBillingInputsBox">
                                <select>
                                    <option value="" disabled selected>Select your state</option>
                                    <option value="AL">Alabama</option>
                                    <option value="AK">Alaska</option>
                                    <option value="AZ">Arizona</option>
                                    <option value="AR">Arkansas</option>
                                    <option value="CA">California</option>
                                    <option value="CO">Colorado</option>
                                    <option value="CT">Connecticut</option>
                                    <option value="DE">Delaware</option>
                                    <option value="DC">District Of Columbia</option>
                                    <option value="FL">Florida</option>
                                    <option value="GA">Georgia</option>
                                    <option value="HI">Hawaii</option>
                                    <option value="ID">Idaho</option>
                                    <option value="IL">Illinois</option>
                                    <option value="IN">Indiana</option>
                                    <option value="IA">Iowa</option>
                                    <option value="KS">Kansas</option>
                                    <option value="KY">Kentucky</option>
                                    <option value="LA">Louisiana</option>
                                    <option value="ME">Maine</option>
                                    <option value="MD">Maryland</option>
                                    <option value="MA">Massachusetts</option>
                                    <option value="MI">Michigan</option>
                                    <option value="MN">Minnesota</option>
                                    <option value="MS">Mississippi</option>
                                    <option value="MO">Missouri</option>
                                    <option value="MT">Montana</option>
                                    <option value="NE">Nebraska</option>
                                    <option value="NV">Nevada</option>
                                    <option value="NH">New Hampshire</option>
                                    <option value="NJ">New Jersey</option>
                                    <option value="NM">New Mexico</option>
                                    <option value="NY">New York</option>
                                    <option value="NC">North Carolina</option>
                                    <option value="ND">North Dakota</option>
                                    <option value="OH">Ohio</option>
                                    <option value="OK">Oklahoma</option>
                                    <option value="OR">Oregon</option>
                                    <option value="PA">Pennsylvania</option>
                                    <option value="RI">Rhode Island</option>
                                    <option value="SC">South Carolina</option>
                                    <option value="SD">South Dakota</option>
                                    <option value="TN">Tennessee</option>
                                    <option value="TX">Texas</option>
                                    <option value="UT">Utah</option>
                                    <option value="VT">Vermont</option>
                                    <option value="VA">Virginia</option>
                                    <option value="WA">Washington</option>
                                    <option value="WV">West Virginia</option>
                                    <option value="WI">Wisconsin</option>
                                    <option value="WY">Wyoming</option>
                                </select>
                                {null ?
                                    <span>
                                        <img src={ExclamationMark} alt="" />
                                        <p>Please enter a state.</p>
                                    </span>
                                    :
                                    null
                                }
                            </div>
                            {/* Country */}
                            <div className="CheckOutBillingInputsBox">
                                <input
                                    placeholder="United States"
                                    defaultValue="United States"
                                    disabled
                                    type="text"
                                />
                                {null ?
                                    <span>
                                        <img src={ExclamationMark} alt="" />
                                        <p>Please enter a country.</p>
                                    </span>
                                    :
                                    null
                                }
                            </div>

                            {/* CheckOutBillingInputsAddress Same Payment */}
                            <div className="CheckOutBillingInputsAddressPayment">
                                <div className="CheckOutBillingInputsAddressPaymentHeader">
                                    <input type="checkbox" id="scales" name="scales" checked />
                                    <p>My delivery and billing addresses are the same.</p>
                                </div>
                            </div>
                        </div>
                        <div className="CheckOutBillingInputsContact">
                            <h1>What’s your contact information?</h1>
                            {/* Email Address */}
                            <div className="CheckOutBillingInputsBox">
                                <input
                                    placeholder="Email Address"
                                    type="email"
                                />
                                {null ?
                                    <span>
                                        <img src={ExclamationMark} alt="" />
                                        <p>Please enter a email address.</p>
                                    </span>
                                    :
                                    null
                                }
                            </div>
                            {/* Phone Number */}
                            <div className="CheckOutBillingInputsBox">
                                <input
                                    placeholder="Phone Number"
                                    type="tel"
                                />
                                {null ?
                                    <span>
                                        <img src={ExclamationMark} alt="" />
                                        <p>Please enter a phone number.</p>
                                    </span>
                                    :
                                    null
                                }
                            </div>
                        </div>
                    </div>
                    <div className="CheckOutBillingContinue">
                        <h2 onClick={() => navigate('/checkout?p=payment')}>Continue to Payment</h2>
                    </div>
                </div>
                :
                // {/* Page 2 Payment */ }
                < div className="CheckOutPayment">
                    <CreditDetails />
                    <div className="CheckOutListFinal">
                        <h6>Order Summary</h6>
                        <div className="CheckOutListFinalSub">
                            <div className="CheckOutListFinalLeft">
                                <h2>Subtotal</h2>
                                <h2>Shipping</h2>
                                <h2>Tax</h2>
                            </div>
                            <div className="CheckOutListFinalRight">
                                <h2>${subTotal.toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</h2>
                                <h2>FREE</h2>
                                <h2>${(subTotal * 0.096).toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</h2>
                            </div>
                        </div>
                        <div className="CheckOutListFinalTotal">
                            <h2>Total</h2>
                            <h2>${(subTotal + (subTotal * 0.096)).toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</h2>
                        </div>
                    </div>
                    <div className="ConfirmPaymentBtn">
                        <h1>Confirm Order</h1>
                    </div>

                </div>
            }
        </div >
    )
}

