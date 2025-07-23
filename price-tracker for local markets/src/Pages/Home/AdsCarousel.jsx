import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";

const AdsCarousel = () => {
  const [ads, setAds] = useState([]);
 console.log(ads);
  useEffect(() => {
    axios.get("http://localhost:3000/advertisements")
      .then(res => setAds(res.data))
      .catch(err => console.error(err));
  }, []);


  return (
    <div className="my-10 max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
        🎯 Advertisement Highlights
      </h2>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Explore all current promotions and vendor ads through this interactive carousel.
       
      </p>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination]}
        className="rounded-2xl overflow-hidden shadow-lg"
      >
        {ads.map(ad => (
          <SwiperSlide key={ad._id}>
            <div className="relative w-full h-64 md:h-80">
              <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0   bg-opacity-40 flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-semibold">{ad.title}</h3>
                <p className="text-sm">{ad.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AdsCarousel;
