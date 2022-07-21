import { addDays, addMinutes } from "date-fns";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";
import { Table } from "../components/dayCalendar/Table";
import useWindowSize from "../hooks/useWindowSize";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [date, setDate] = useState(new Date)
  const { width } = useWindowSize()

  return (
    <>
          <div>
        {width && width > 600 ? 'width > 600' : 'width < 600'}
      </div>
      {width && <Table screenWidth={width}/>}
    </>
  );
};

export default Home;
