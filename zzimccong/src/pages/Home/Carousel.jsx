import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import image1 from "../../assets/icons/Carousel1.png";
import image2 from "../../assets/icons/Carousel2.png";
import image3 from "../../assets/icons/Carousel3.png";
import image4 from "../../assets/icons/Carousel4.png";

const slideItem = [
  {
    id: 0,
    url: image1,
  },
  {
    id: 1,
    url: image2,
  },
  {
    id: 2,
    url: image3,
  },
  {
    id: 3,
    url: image4,
  },
];

export default function Carousel() {
  return (
    <div className="slider mb-[16px] mt-[48px]">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={8}
        pagination={true}
        slidesPerView={"auto"}
        autoplay={{
          delay: 3500,
        }}
      >
        {slideItem.map((item, index) => {
          return (
            <SwiperSlide key={item.id}>
              <a>
                <img src={item.url}></img>
              </a>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
