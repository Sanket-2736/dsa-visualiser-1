import React from 'react'
import HeroSection from '../components/HeroSection'
import InteractiveLearning from '../components/IInteractiveLearning'
import DataStructuresSection from '../components/DataStructuresSection'
import TestimonialSection from '../components/TestimonialSection'
import FeatureHub from '../components/FeatureHub'

function Home() {
  return (
    <div>
      {/* hero section: */}
      <HeroSection/>
      {/* interative learning section */}
      <InteractiveLearning/>
      {/* explore data structures */}
      <DataStructuresSection/>
      <FeatureHub/>
      {/* testimonials */}
      <TestimonialSection/>
    </div>
  )
}

export default Home
