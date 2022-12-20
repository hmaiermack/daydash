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




const Home: NextPage = () => {
  return (
    <CalendarContextProvider>
      <EditModalProvider>
        <CreateModalProvider>
          <EventInteractionModalProvider>

            <div>
              <button onClick={()=> signIn()} className="mx-4">Sign in</button>
            <CalendarContainer />

            <div className="w-full h-40 bg-green-400 mt-5"></div>
            </div>
          </EventInteractionModalProvider>
        </CreateModalProvider>
        </EditModalProvider>
    </CalendarContextProvider>
  );
};

export default Home;
