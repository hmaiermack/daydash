import { addDays, addMinutes } from "date-fns";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { DayTable } from "../components/dayCalendar/DayTable";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [date, setDate] = useState(new Date)
  const getTasks = trpc.useQuery(["tasks.tasks", {date}]);
  const newTask = trpc.useMutation("tasks.new-task")

  const handleClick = async () => {
    newTask.mutate({
      title: "First Task",
      timeStart: addDays(date, 1),
      timeEnd: addMinutes(addDays(date, 1), 5),
    })
  }

  return (
    <>
    <DayTable />
    </>
  );
};

export default Home;
