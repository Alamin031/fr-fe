import { Toaster } from 'react-hot-toast';
import LogoutButton from '../../../../../authcation/logout';
import Signup from '../../../../../authcation/Signup';

const sigup = () => {
  return(
    <>
          <Toaster position="top-right" reverseOrder={false} />

    <LogoutButton></LogoutButton>


 <Signup/>
    </>

  
  )
  

};

export default sigup;