import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import bannerImage from '../../assets/icons/banner.png';

const slideItem = [
  {
    id: 0,
    url: "https://ugc-images.catchtable.co.kr/admin/marketing/banner/images/3bf5d2c1564a46368375bae358767d3f",
  },
  {
    id: 1,
    url: "https://ugc-images.catchtable.co.kr/admin/marketing/banner/images/62a52aa955f949c589aae83ad0eb00c3",
  },
  {
    id: 2,
    url: "https://ugc-images.catchtable.co.kr/admin/marketing/banner/images/077887ecd3fc4ba2a38c1d0e370b7d5f",
  },
  {
    id: 3,
    url: "https://d3kzx7mqemhf0.cloudfront.net/common_img/comm_2422211081434326.webp",
  },
  {
    id: 4,
    url: bannerImage // 로컬 이미지 파일의 경로 사용
  }
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
                <img src={item.url} ></img>
              </a>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
