// export default function Home() {
//   return <main className="flex items-center justify-center h-screen ">Hello Next.js with Tailwind!</main>;
// }


import BookingModal from '@/components/BookingModal/BookingModal';
import FarmDetail from '@/components/Farm/FarmDetail';
import FarmList from '@/components/FarmList/FarmList';
import CustomerReviews from '@/components/Reviews/CustomerReviews';
import VideoGallery from '@/components/VideoGallery/VideoGallery';
import BookingConfirmation from '@/pages/BookingConfirmation';
import Contact from '@/pages/Contact';
import FAQ from '@/pages/FAQ';
import HappyCustomers from '@/pages/HappyCustomers';
import Homes from '@/pages/Home';
import HowItWorks from '@/pages/HowItWorks';
import NotFound from '@/pages/not-found';
import OwnerDashboard from '@/pages/OwnerDashboard';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import PropertyRegistration from '@/pages/PropertyRegistration';
import SavedFarms from '@/pages/saved';
import TermsOfService from '@/pages/TermsOfService';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full">
      

      <FarmDetail/>

<BookingConfirmation/>
<HowItWorks/>
<NotFound/>
<OwnerDashboard/>
<PrivacyPolicy/>

<SavedFarms/>
<TermsOfService/>

{/* <FarmList />
<VideoGallery />
<CustomerReviews />
<BookingModal /> */}


    </main>
  );
}