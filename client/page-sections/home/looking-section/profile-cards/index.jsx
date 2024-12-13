/* eslint-disable @next/next/no-img-element */
import Image from "next/image";

import hand from "public/assets/imgs/kris.webp";
import stay from "public/assets/imgs/emily.webp";

import style from "./profile.module.scss";

const ProfileCards = () => {
  return (
    <div className={style.grid}>
      {cards.map((ele, index) => (
        <div className={style.card2} key={index}>
          <div className={style.topsec}>
            <div className={style.imgsec}>
              <Image src={ele.img} width="181px" height="181px" alt="testimonial" />
            </div>
            <div className={style.introsec}>
              <span className={style.name}>{ele.name}</span>
              <span className={style.rank}>{ele.spanName}</span>
            </div>
          </div>
          <p className={style.details}>{ele.para}</p>
        </div>
      ))}
    </div>
  );
};

export default ProfileCards;

const cards = [
  {
    img: hand,
    name: "Kris",
    spanName: "Stable Manager Equitation",
    para: ` As a manager of one of the biggest Equitation stable in US, dealing with a lot of clients, I am constantly looking for staff. A freelance groom to help me for the summer in Europe or cover for staff on holiday. A fulltime employee as we expanding our team every year or a property manager to take care of our farm up north when we head down to Florida for the winter season.
These are the type of postions Yehaww will help me fill and I can not wait to get started.`,
  },
  {
    img: stay,
    name: "Emily",
    spanName: "Logistics coordinator Shipping company",
    para: `Logistics coordinator Shipping company
We all know how short notice we sometimes get for sending a shipment with horses across Europe or to England. How hard it can be to find a reliable person to travel with the horses we care so much about.
I believe Yehaww will make the process of finding someone to help on short notice, way faster. Whether it’s a driver or perhaps a flight groom. I am so excited to see what this website can do for our industry.`,
  },
];
