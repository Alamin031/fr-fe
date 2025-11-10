'use client'
import { Toaster } from 'react-hot-toast';
import Signup from '../../../../../authcation/Signup';

const sigup = () => {
  return(
    <>
          <Toaster position="top-right" reverseOrder={false} />



 <Signup/>
    </>

  
  )
  

};

export default sigup;