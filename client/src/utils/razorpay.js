import { creatAdvertise, renewAd } from "../Api/advertise";

function razorpayPayment({order,razorpayOrder},type,Idadvertise) {
   
    return new Promise((resolve, reject) => {
        const options = {
            key: "rzp_test_E5WE0z0SgB6EwW",
            amount: razorpayOrder.amount * 100,
            currency: razorpayOrder.currency,
            name: 'ad 2 gro',
            description: 'Purchase Description',
            order_id: razorpayOrder.id,
            handler: async function (response) {
                console.log('Payment successful:', response);

                // Call your API after successful payment
                 if(type){
                    await renewAd(order.id,Idadvertise)

                 }else{

                     await creatAdvertise(order.id);
                 }

                // Resolve promise after payment success
                resolve(response);
            },
            prefill: {
                name: order.orderData.contactName,
                email: order.orderData.contactEmail,
                contact: order.orderData.contactPhone
            },
            notes: {
                address: 'Customer Address'
            },
            theme: {
                color: '#3399cc'
            }
        };

        const rzp1 = new window.Razorpay(options);

        rzp1.on('payment.failed', function (response) {
            console.error('Payment failed:', response.error);
            reject(response.error); // If payment failed
        });

        rzp1.open();
    });
}

export default razorpayPayment;
