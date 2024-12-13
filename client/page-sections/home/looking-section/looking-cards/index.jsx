/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";

import Card from "components/card";

import emi from "public/assets/icons/hands-on.webp";
import king from "public/assets/clean.svg";

import style from "./looking-cards.module.scss";

const LookingCards = () => {
  return (
    <>
      <div className={style.parent}>
        {cards.map((ele, index) => (
          <Link key={index} href={ele?.link}>
            <Card className={style.card}>
              <div className={style.main}>
                <div className={style.imgDiv}>
                  <div className={style.image1}>
                    <Image src={ele.img} alt="hand" height={"100%"} width="100%" />
                  </div>

                  <h4>{ele.title}</h4>
                </div>

                <p className={style.p1}>
                  {ele.para} <span>{ele.spanTag}</span>
                </p>
                <p className={style.p1}>{ele.para2}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
};

export default LookingCards;

const cards = [
  {
    img: emi,
    title: "Hands on",
    link: "/jobs?jobType=Hands On",
    para: " Always wanted to have your passion as your ",
    spanTag: "job?",
    para2: `With Yehaww “Hands on” applicant account you can find that job today! Travel the world as a Show Groom in different disciplines, flat ride the world’s best horses or help produce the new generation of young horses! 
    Create your profile and start your new equestrian lifestyle! `,
  },
  {
    img: king,
    title: "Stay clean",
    link: "/jobs?jobType=Stay Clean",
    para: "Want to stay in the equine industry without being in the",
    spanTag: " barn?",
    para2: `With Yehaww “stay clean” applicant account that dream can come true! 
Create your profile today and get access to various positions outside the barn! Explore a career as a personal assistant or a nanny! Yehaww will provide the tools to start a new adventure.`,
  },
];
