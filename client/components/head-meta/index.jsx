import Head from "next/head";

const HeadSeo = ({ title, description, ogImage, altText, children }) => {
  return (
    <Head>
      {/* twitter metadata */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="Yehaww" />

      <meta property="og:description" content={description} />

      <meta property="og:title" content={title} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="280" />
      <meta property="og:image:alt" content={altText} />
      {children}
    </Head>
  );
};

export default HeadSeo;
