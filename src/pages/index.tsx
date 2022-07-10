/* eslint-disable @next/next/no-page-custom-font */
import type { NextPage } from "next";
import Head from "next/head";

import SignIn from "./SignIn/SignIn";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Todo nineBox</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <SignIn />
    </>
  );
};

export default Home;
