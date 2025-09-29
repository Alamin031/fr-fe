import React, { Suspense } from 'react';
import CheckoutForm from '../../../utils/checkoutComponts/CheckoutForm';

const checkout = () => {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>

    <CheckoutForm></CheckoutForm>
    </Suspense>

  )
};

export default checkout;