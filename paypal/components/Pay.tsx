"use client"
import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { OnApproveData, OnApproveActions } from '@paypal/paypal-js';


// Renders errors or successfull transactions on the screen.
function Message({ content }: {content: string}) {
    return <p>{content}</p>;
}

const clientID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string;
const initialOptions = {
    "clientId": clientID,
    "enable-funding": "venmo",
    "disable-funding": "",
    "buyer-country": "US",
    currency: "USD",
    "data-page-type": "product-details",
    components: "buttons",
    "data-sdk-integration-source": "developer-studio",
};


function Paypal() {
    const [message, setMessage] = useState("");
    const [quantity, setQuantity] = useState(1);

    function handleQuantityChange(value: string) {
        let int = parseInt(value, 10);
        if (isNaN(int)) {
            int = 1;
        }
        setQuantity(int);
    }
    
    const createOrder = async (quantity: number) => {
        // Check on quantity
        console.log(quantity);
        if (quantity <= 0) {
            console.log("zero");
            return
        };

        try {
            console.log("api called");
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // use the "body" param to optionally pass additional order information
                // like product ids and quantities
                body: JSON.stringify({
                    cart: [
                        {
                            id: "someid",
                            quantity: quantity.toString(),
                        },
                    ],
                }),
            });

            const orderData = await response.json();
            console.log("order data: ", orderData);

            if (orderData.id) {
                return orderData.id;
            } else {
                const errorDetail = orderData?.details?.[0];
                const errorMessage = errorDetail
                    ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                    : JSON.stringify(orderData);

                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error(error);
            setMessage(
                `Could not initiate PayPal Checkout...${error}`
            );
        }
    }
    
    const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
        console.log("on approve called")
        try {
            const response = await fetch(
                `/api/orders/${data.orderID}/capture`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const orderData = await response.json();
            // Three cases to handle:
            //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            //   (2) Other non-recoverable errors -> Show a failure message
            //   (3) Successful transaction -> Show confirmation or thank you message

            const errorDetail = orderData?.details?.[0];

            if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                return actions.restart();
            } else if (errorDetail) {
                // (2) Other non-recoverable errors -> Show a failure message
                throw new Error(
                    `${errorDetail.description} (${orderData.debug_id})`
                );
            } else {
                // (3) Successful transaction -> Show confirmation or thank you message
                // Or go to another URL:  actions.redirect('thank_you.html');
                const transaction =
                    orderData.purchase_units[0].payments
                        .captures[0];
                setMessage(
                    `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
                );
                console.log(
                    "Capture result",
                    orderData,
                    JSON.stringify(orderData, null, 2)
                );
            }
        } catch (error) {
            console.error(error);
            setMessage(
                `Sorry, your transaction could not be processed...${error}`
            );
        }
    };

    return (
        <div className="App">
            <input
                type="number"
                placeholder="Enter Quantity"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                className="text-black m-5 p-5"
                min="1"
            />
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                    key={`paypal-button-${quantity}`}
                    style={{
                        shape: "pill",
                        layout: "vertical",
                        color: "gold",
                        label: "pay",
                    }} 
                    createOrder={() => createOrder(quantity)}
                    onApprove={onApprove} 
                />
            </PayPalScriptProvider>
            <Message content={message} />
        </div>
    );
}

export default Paypal; 