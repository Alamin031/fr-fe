import LandingpageBenar from '@/components/utils/LandpageBenar';
import  DesboardFectures from '@/components/utils/landipagedeshboard_fecturesCompo';
import AdminManagementProvider from '@/providers/AdminManagementProvider';
const page = () => {
  return (
    <AdminManagementProvider>
       <div>
      <LandingpageBenar />
      <DesboardFectures />
    </div>

    </AdminManagementProvider>
   
  );
};

export default page;
      

