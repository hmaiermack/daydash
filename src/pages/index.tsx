import { addDays, addMinutes } from "date-fns";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { Table } from "../components/dayCalendar/Table";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [date, setDate] = useState(new Date)

  return (
    <>
    <Table />
    </>
  );
};

export default Home;
