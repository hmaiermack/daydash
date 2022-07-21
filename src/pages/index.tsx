import type { NextPage } from "next";
import { useState } from "react";
import { Table } from "../components/dayCalendar/Table";
import useWindowSize from "../hooks/useWindowSize";

const Home: NextPage = () => {
  const { width } = useWindowSize()

  return (
    <>
      <div>
      </div>
      {width && <Table screenWidth={width}/>}
    </>
  );
};

export default Home;
