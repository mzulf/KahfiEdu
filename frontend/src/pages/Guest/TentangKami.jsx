import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import HeroAbout from '../../components/Guest/about/HeroAbout';
import VIsiMisi from '../../components/Guest/about/VIsiMisi';
import NilaiNilai from '../../components/Guest/about/NilaiNilai';
import ContactUs from '../../components/Guest/about/ContactUs';

const TentangKami = () => {
  return (
    <>
      {/* Section: Tentang Kami */}
      <section id='hero-about'>
        <HeroAbout />
      </section>

      <section id='visi-misi' className='mt-10'>
        <VIsiMisi />
      </section>

      <section id='nilai-nilai' className='mt-10'>
        <NilaiNilai />
      </section>

      <section id='contact'>
        <ContactUs />
      </section>
    </>
  );
};

export default TentangKami;
