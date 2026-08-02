import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'

const Home = () => {
  useGetAllJobs();

  return (
    <div>
      <Navbar />
      <HeroSection />
      <LatestJobs />
      <Footer />
    </div>
  );
};

export default Home;
