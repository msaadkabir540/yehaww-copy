/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";

import Badge from "components/badge";
import Button from "components/button";
import Card from "components/card";

import style from "./list.module.scss";
import Image from "next/image";

const List = ({
  id,
  text,
  title,
  listId,
  btnList,
  listArr,
  buttons,
  btnFlex,
  tagClass,
  list_img,
  className,
  removeBtn,
  titleLink,
  badgeClass,
  badgeTitle,
  badgeTitle1,
  applicationTitle,
}) => {
  const router = useRouter();

  return (
    <Card className={className}>
      <div className={style.listing}>
        <div className={style.list_info}>
          <div className={style.job_info}>
            <div className={style.innerDiv}>
              <div>
                <Link href={titleLink || "#"}>
                  <h4 style={{ cursor: "pointer" }}>
                    {title}
                    {badgeTitle && (
                      <Badge title={badgeTitle} className={`${style.tag_success} ${badgeClass}`} />
                    )}
                  </h4>
                </Link>
                {badgeTitle1 && (
                  <Badge title={badgeTitle1} className={`${style.tag_success} ${tagClass}`} />
                )}
              </div>
              {list_img && (
                <div className={style.imgDiv}>
                  <Image src={list_img} width={50} height={50} alt={"job img"} />
                </div>
              )}
            </div>
            <ul>{listArr?.map((ele, index) => ele !== null && <li key={index}>{ele}</li>)}</ul>
            {removeBtn && (
              <>
                <div className={style.submitted}>
                  <h4>{applicationTitle}</h4>
                  <p>{text}</p>
                </div>
                <p
                  className={style.btnRemove}
                  onClick={() => {
                    removeBtn.handleClick && removeBtn.handleClick();
                  }}
                >
                  {removeBtn.title}
                </p>
              </>
            )}
            {btnList && (
              <div className={style.btns}>
                {btnList?.map((ele, index) => (
                  <p
                    key={index}
                    onClick={() => {
                      ele?.onClick(id || listId);
                    }}
                  >
                    {ele.text}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className={`${style.list_action} ${btnFlex}`}>
          {buttons?.length > 0 &&
            buttons
              .filter((x) => x.title)
              .map(({ title, link, btnClass, handleClick }, index) => (
                <Button
                  key={index}
                  title={title}
                  className={btnClass}
                  handleClick={() => {
                    handleClick && handleClick();
                    link && router.push(link);
                  }}
                />
              ))}
        </div>
      </div>
    </Card>
  );
};

export default List;
