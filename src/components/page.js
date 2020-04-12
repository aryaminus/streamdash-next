import React from "react";
import Head from "next/head";
import styled from "styled-components";

const Page = (props) => {
  return (
    <>
      <Head>
        <title>{props.title}</title>
      </Head>
      <Content>{props.children}</Content>
    </>
  );
};

export default Page;

const Content = styled.div`
  margin-left: 250px;
  @media (${(props) => props.theme.breakpoint}) {
    margin-left: 0;
  }
`;
