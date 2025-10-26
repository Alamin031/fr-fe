import Banner from '@/components/Banner';
import Macbook from '@/components/Macbook';
import AppleProduct from '@/components/AppleProduct';
import FeaturesBanner from '@/components/utils/FeaturesBanner';
import Footer from '@/components/utils/footer';

// import { connect } from "@/dbconfig/dbconfig";
// await connect()

const page = () => {
  return (
    <div>

       <Banner/>
       <FeaturesBanner></FeaturesBanner>
      <Macbook></Macbook>

      <AppleProduct></AppleProduct>
      <Footer></Footer>

    </div>
     
      
  );
};

export default page;