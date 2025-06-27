

function razorpayPaymentCoffee({coffee,razorpayOrder}) {
   
    return new Promise((resolve, reject) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
            amount: razorpayOrder.amount * 100,
            currency: razorpayOrder.currency,
            name: 'AdToGro',
            description: 'Membership by buying coffee',
            order_id: razorpayOrder.id,
            handler: async function (response) {
              
                // Call your API after successful payment
                
             
                   

                       resolve({response,coffeeId:coffee.id});
                   
              

                // Resolve promise after payment success
            },
            prefill: {
                name: "name",
                email: "email@gmail.com",
                contact: "123456789"
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

export default razorpayPaymentCoffee;
