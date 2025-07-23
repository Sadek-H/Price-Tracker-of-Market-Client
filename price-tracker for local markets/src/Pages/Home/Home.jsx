import React from 'react';
import Banner from './Banner';
import ProductPreview from './ProductPreview';
import AdsCarousel from './AdsCarousel';
import TracPrices from './TracPrices';
import HowWorks from './HowWorks';

const Home = () => {
    return (
        <div>
           <Banner></Banner> 
           <ProductPreview></ProductPreview>
           <AdsCarousel></AdsCarousel>
           <TracPrices></TracPrices>
           <HowWorks></HowWorks>
        </div>
    );
};

export default Home;