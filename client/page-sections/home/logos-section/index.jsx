import React, { useRef } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import igaLogo from "public/assets/imgs/iga-logo.jpg";
import trueLogo from "public/assets/imgs/lillelogo.webp";
import wellington from "public/assets/imgs/wellington.png";
import horsegrooms from "public/assets/imgs/horsegrooms.png";
import uhip from "public/assets/imgs/uhip-scandinavian-equestrian-wear.png";
import myShowAdvisor from "public/assets/imgs/high res.logo.webp";
import style from "./logos.module.scss";

const LogosSection = () => {
  const settings = {
    speed: 2000,
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: false,
    slidesToShow: 4,
    centerMode: true,
    slidesToScroll: 1,
    centerPadding: "10px",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          arrows: false,
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 821,
        settings: {
          arrows: false,
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          slidesToShow: 1,
        },
      },
    ],
  };
  const sliderRef = useRef(null);

  return (
    <div id="partners" className={style.innerLogos}>
      <div className={style.imgDiv}>
        <div className={style.card}>
          <Slider {...settings} ref={sliderRef}>
            {logos?.map((ele, index) => (
              <a href={ele.link} target="_blank">
                <div className={style.img1}>
                  <Image className={style.img} src={ele.src} alt="logo" key={index} />
                </div>
              </a>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default LogosSection;

const logos = [
  {
    link: "#",
    src: trueLogo,
  },
  {
    link: "https://www.myshowadvisor.com/",
    src: myShowAdvisor,
  },
  {
    link: "https://wellingtoninternational.com/",
    src: wellington,
  },
  {
    link: "https://horsegrooms.com/",
    src: horsegrooms,
  },
  {
    link: "#",
    src: trueLogo,
  },
  {
    link: "https://www.myshowadvisor.com/",
    src: myShowAdvisor,
  },
  {
    link: "https://wellingtoninternational.com/",
    src: wellington,
  },
  {
    link: "https://horsegrooms.com/",
    src: horsegrooms,
  },
  {
    link: "https://uhipwear.com/",
    src: uhip,
  },
  {
    link: "https://internationalgrooms.org/",
    src: igaLogo,
  },
];
