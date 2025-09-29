import Banner from '@/components/Banner';
import Macbook from '@/components/Macbook';
import AppleProduct from '@/components/AppleProduct';
import { connect } from "@/dbconfig/dbconfig";
await connect()

const page = () => {
  return (
    <div>
       <Banner />
      <Macbook></Macbook>
      <AppleProduct></AppleProduct>

    </div>
     
      
  );
};

export default page;