import { useState } from "react";
import axios from "axios";

import Button from "components/button";
import FormSection from "./form-section";
import Container from "components/container";
import HeaderSection from "./header-section";
import NewYehaww from "components/new-yehaww";

import style from "./contact.module.scss";
import download from "public/assets/download.png";

const ContactSection = () => {
  const [loading, setLoading] = useState(false);

  const downloadFileData = async () => {
    setLoading(true);
    let response = await axios({
      method: "GET",
      url: `/utils/download?s3Url=${process.env.NEXT_PUBLIC_BROCHURE_URL}`,
      responseType: "blob",
    });
    const href = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", "yehaww-brochure.pdf");
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    setLoading(false);
  };

  return (
    <div>
      <HeaderSection />
      <Container>
        <div className={style.brouchers}>
          <h6>Download our brochures</h6>
          <p>Find out all about what Yehaww can do for you in our brochure</p>
          <div className={style.btnDiv}>
            <Button
              title="Yehaww Brochure"
              loaderClass={style.loaderClass}
              isLoading={loading}
              icon={loading ? "" : download}
              handleClick={() => {
                downloadFileData();
              }}
            />
          </div>
        </div>
        <div className={style.gridDiv}>
          <FormSection />
        </div>
      </Container>
    </div>
  );
};

export default ContactSection;
