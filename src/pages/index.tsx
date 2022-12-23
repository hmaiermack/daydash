import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import useWindowSize from "../hooks/useWindowSize";
import { Controller, useForm } from "react-hook-form";
import { CreateModalProvider } from "../context/CreateModalContext";
import { EventInteractionModalProvider } from "../context/EventInteractionModalContext";
import CalendarContainer from "../components/dayCalendar/CalendarContainer";
import { CalendarContextProvider } from "../context/CalendarContext";
import { EditModalProvider } from "../context/EditModalContext";
import HabitContainer from "../components/habits/HabitContainer";




const Home: NextPage = () => {
  return (
    <CalendarContextProvider>
      <EditModalProvider>
        <CreateModalProvider>
          <EventInteractionModalProvider>

            <div>
            <CalendarContainer />

            <HabitContainer />
            </div>
          </EventInteractionModalProvider>
        </CreateModalProvider>
        </EditModalProvider>
    </CalendarContextProvider>
  );
};

export default Home;
