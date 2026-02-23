import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Impact from '../components/Impact';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';

const Home = () => {
    return (
        <main>
            <Hero />
            <Features />
            <HowItWorks />
            <Impact />
            <Testimonials />
            <Newsletter />
        </main>
    );
};

export default Home;
