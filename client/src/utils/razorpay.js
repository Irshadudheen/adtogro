function razorpayPayment(order){
    const option = {
            key:"rzp_test_E5WE0z0SgB6EwW",
            amount: order.amount*100,
            currency: order.currency,
            name: 'adMetrix',
            description: 'Purchase Description',
            order_id: order.id,
            handler: function(response) {
                // Handle the success response here
                console.log('Payment successful:', response);
           
                // verifyPayment(response,order)
                // Redirect or show success message
                fetch('/succesPayment',{
                    method:'POST',
                   
                })
            },
            prefill: {
                name: 'Customer Name',
                email: 'customer@example.com',
                contact: '9999999999'
            },
            notes: {
                address: 'Customer Address'
            },
            theme: {
                color: '#3399cc'
            }
        };
        const rzp1 = new  Razorpay(option);
        rzp1.open()
    }
    export default razorpayPayment