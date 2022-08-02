import type { NextPage } from "next";
import { useState } from "react";
import { Table } from "../components/dayCalendar/Table";
import useWindowSize from "../hooks/useWindowSize";

const Home: NextPage = () => {
  const { width, height } = useWindowSize()
console.log(height)
  return (
    <>
      <div>
      </div>
      {width && <Table screenWidth={width}/>}
    </>
  );
};

export default Home;
