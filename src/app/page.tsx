import Banner from '@/components/Banner';
import Macbook from '@/components/Macbook';
import AppleProduct from '@/components/AppleProduct';
import FeaturesBanner from '@/components/utils/FeaturesBanner';
import Footer from '@/components/utils/footer';
import ResponsiveEcommerce from "../components/components/ResponsiveEcomerce";
// import { connect } from "@/dbconfig/dbconfig";
// await connect()

const page = () => {
  return (
    <div>
        <ResponsiveEcommerce></ResponsiveEcommerce>


       <Banner/>
       <FeaturesBanner></FeaturesBanner>
       <Macbook></Macbook>

      <AppleProduct></AppleProduct>
      <Footer></Footer>

    </div>
     
      
  );
};

export default page;