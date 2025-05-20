import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import NftStats from '../components/NftStats';
import MintForm from '../components/MintForm';

const Home = () => {

 
  return (
    <div className="">
      <Navbar />
      <Hero />
      <div className='bg-[#1A1F2C] p-4'>
        <NftStats />
        <MintForm />
        <footer>
        <div className='text-white mt-20 mb:mt-20 text-center'>
            <p className='text-sm'>Powered By</p>
            <span className='text-2xl font-bold'>NiyiToken</span>
            <p className='text-sm'>Copyright © 2025 NiyiToken</p>
            <p className='text-sm'>All rights reserved</p>
          <span>Built By NIYI</span>
        </div>
      </footer>
      </div>      
      
      
    </div>
  )
}

export default Home