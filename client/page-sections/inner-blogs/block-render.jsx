"use client";
import React from "react";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

import BlogImage from "components/blogs-component/image";
import CodeComponent from "components/blogs-component/code";
import ListComponent from "components/blogs-component/list";
import LinkComponent from "components/blogs-component/link";
import Paragraph from "components/blogs-component/paragraph";
import Heading1 from "components/blogs-component/headings/h1";
import Heading2 from "components/blogs-component/headings/h2";
import Heading3 from "components/blogs-component/headings/h3";
import Heading4 from "components/blogs-component/headings/h4";
import Heading5 from "components/blogs-component/headings/h5";
import Heading6 from "components/blogs-component/headings/h6";

const BlockRender = ({ content }) => {
  if (!content) return null;
  return (
    <BlocksRenderer
      content={content}
      blocks={{
        heading: ({ children, level }) => {
          switch (level) {
            case 1:
              return <Heading1>{children}</Heading1>;
            case 2:
              return <Heading2>{children}</Heading2>;
            case 3:
              return <Heading3>{children}</Heading3>;
            case 4:
              return <Heading4>{children}</Heading4>;
            case 5:
              return <Heading5>{children}</Heading5>;
            case 6:
              return <Heading6>{children}</Heading6>;
            default:
              return <Heading1>{children}</Heading1>;
          }
        },
        image: ({ image }) => {
          return (
            <BlogImage
              src={image.url}
              width={image.width}
              height={image.height}
              alt={image.alternativeText || ""}
            />
          );
        },
        paragraph: ({ children }) => {
          return <Paragraph>{children}</Paragraph>;
        },
        quote: ({ children }) => {
          return <Quote> {children}</Quote>;
        },
        code: ({ children }) => {
          return <CodeComponent> yes Hnan{children}</CodeComponent>;
        },
        link: ({ children }) => {
          return <LinkComponent>{children}</LinkComponent>;
        },
        list: ({ format, children }) => {
          return format === "ordered" ? (
            <ListComponent>
              Order List
              {children}
            </ListComponent>
          ) : (
            <ListComponent>
              un Order list
              {children}
            </ListComponent>
          );
        },
      }}
    />
  );
};

export default BlockRender;
