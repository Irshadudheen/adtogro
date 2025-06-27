import { creatAdvertise, renewAd } from "../Api/advertise";

function razorpayPayment({order,razorpayOrder},type,Idadvertise) {
   
    return new Promise((resolve, reject) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
            amount: razorpayOrder.amount * 100,
            currency: razorpayOrder.currency,
            name: 'AdToGro',
            description: 'Purchase Description',
            order_id: razorpayOrder.id,
            handler: async function (response) {
               

                // Call your API after successful payment
                
                if(type=='renew'){

                   
                   

                       resolve({response,orderId:order.id});
                   
                 }else{

                     await creatAdvertise(order.id);
                     resolve(response);
                 }

                // Resolve promise after payment success
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
                color: '#f5b942'
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
