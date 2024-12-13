import style from "./question.module.scss";

const SubscriptionContent = ({ subscriptionData }) => {
  return (
    <div className={style.main}>
      <div>
        <h1 style={{ marginTop: "0px" }}>Select your Subscription plan</h1>
        <span className={style.span}>
          We created Yehaww.com as a tool to connect talented people all over the world throughout
          the equine industry.
        </span>
        <span className={style.span}>
          Our goal is to have a database that will make the equestrian community stronger and more
          united.
        </span>
        <span className={style.span}>
          Please be advised that your subscription will remain active and will continue to be
          charged until you choose to cancel your membership.
        </span>
      </div>
    </div>
  );
};

export default SubscriptionContent;

export const columns = [
  {
    width: "160px",
    alignText: "center",
    key: "transactionId",
    name: "Transaction ID",
  },
  {
    width: "160px",
    alignText: "center",
    key: "transactionDate",
    name: "Transaction Date",
  },
  {
    key: "plan",
    name: "Plan",
    width: "100px",
    alignText: "center",
  },
  {
    key: "amount",
    name: "Amount",
    width: "100px",
    alignText: "center",
  },
  {
    key: "discount",
    name: "Discount",
    width: "100px",
    alignText: "center",
  },
  {
    key: "percentage",
    name: "discount %",
    width: "100px",
    alignText: "center",
  },
  {
    key: "discountAmounts",
    name: "Discounted Amount",
    width: "100px",
    alignText: "center",
  },

  {
    width: "260px",
    key: "duration",
    name: "Duration",
    alignText: "center",
  },
];
