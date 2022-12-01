import { addDays, addMinutes } from "date-fns";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import Cal from "../components/calendar/Calendar";
import { Table } from "../components/dayCalendar/Table";
import DayCalendar from "../components/etc/DayCalendar";
import useWindowSize from "../hooks/useWindowSize";
import { trpc } from "../utils/trpc";
import Testing from "../components/dayCalendar/Testing";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from "@mui/material";
import ColorPicker from "../components/dayCalendar/colorPicker";




const Home: NextPage = () => {
  const [date, setDate] = useState(new Date)
  // const getTasks = trpc.useQuery(["tasks.tasks", {date}]);
  const { register, handleSubmit, watch, formState: { errors }, control } = useForm();

  const {width} = useWindowSize()



  return (
    <>
      <div>
      <ColorPicker />
        <button onClick={()=> signIn()} className="mx-4">Sign in</button>
      {/* {width && 
        <Table screenWidth={width}/>
      } */}
      {/* <Testing /> */}

      <div className="w-full h-40 bg-green-400 mt-5"></div>
      </div>
    </>
  );
};

export default Home;
