import HeroSection from '../../components/Guest/beranda/HeroSection';
import KenapaSection from '../../components/Guest/beranda/KenapaSection';
import ProgramSection from '../../components/Guest/beranda/ProgramSection';
import TentangSection from '../../components/Guest/beranda/TentangSection';
import TestimoniSection from '../../components/Guest/beranda/TestimoniSection';

const Beranda = () => (
  <>
    <section id='hero'>
      <HeroSection />
    </section>
    <section id='tentang-kahfi'>
      <TentangSection />
    </section>
    <section id='why' className='mt-20'>
      <KenapaSection />
    </section>
    <section id='program' className='mt-20'>
      <ProgramSection />
    </section>
    <section id='testimoni' className='mt-20'>
      <TestimoniSection />
    </section>

  </>
);

export default Beranda;
