/* eslint-disable @next/next/no-img-element */
import { Carousel } from "react-responsive-carousel";

import style from "./carousel.module.scss";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Container from "components/container";
import Image from "next/image";

const RecruitCarousel = () => {
  return (
    <Container>
      <div className={style.carousel}>
        <h3 className={style.heading}>This is what our clients are saying about us</h3>
        <Carousel
          autoPlay
          showArrows={false}
          showThumbs={true}
          showStatus={false}
          className={style.carousel}
        >
          {caro.map((ele, index) => (
            <div className={style.commonClass} key={index}>
              <div className={style.commonClass1}>
                <div className={style.imgSec}>
                  <Image src={ele.img} alt="profile" width={181} height={181} objectFit="cover" />
                </div>
                <div className={style.topSec}>
                  <p className={style.nameSec}>{ele.heading}</p>
                  <p className={style.detailsSec1}>{ele.title}</p>
                  <p className={style.detailsSec}>{ele.para}</p>
                  <p className={style.detailsSec1}>{ele.date}</p>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </Container>
  );
};

export default RecruitCarousel;

const caro = [
  {
    img: "/assets/imgs/kris.webp",
    heading: "Kris",
    title: "Stable Manager Equitation",
    para: "As a manager of one of the biggest Equitation stable in US, dealing with a lot of clients, I am constantly looking for staff. A freelance groom to help me for the summer in Europe or cover for staff on holiday. A fulltime employee as we expanding our team every year or a property manager to take care of our farm up north when we head down to Florida for the winter season. These are the type of positions Yehaww will help me fill and I can not wait to get started.",
    date: "November 29, 2022",
  },
  {
    img: "/assets/imgs/emily.webp",
    heading: "Emily",
    title: "International Equine transport operation manager",
    para: "We all know how short notice we sometimes get for sending a shipment with horses across Europe or to England. How hard it can be to find a reliable person to travel with the horses we care so much about. I believe Yehaww will make the process of finding someone to help on short notice, way faster. Whether it’s a driver or perhaps a flight groom. I am so excited to see what this website can do for our industry.",
    date: "November 29, 2022",
  },
];
