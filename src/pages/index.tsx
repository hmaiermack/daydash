import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { CreateModalProvider } from "../context/CreateModalContext";
import { EventInteractionModalProvider } from "../context/EventInteractionModalContext";
import CalendarContainer from "../components/dayCalendar/CalendarContainer";
import { CalendarContextProvider } from "../context/CalendarContext";
import { EditModalProvider } from "../context/EditModalContext";
import HabitContainer from "../components/habits/HabitContainer";




const Home: NextPage = () => {
  const {status} = useSession()
  return (
    <CalendarContextProvider>
      <EditModalProvider>
        <CreateModalProvider>
          <EventInteractionModalProvider>
            <div>
            {status === "authenticated" ? (
              <>
                <CalendarContainer />
                <HabitContainer />
              </>
            ) : (
              <span>you need to sign in</span>)}
            </div>
          </EventInteractionModalProvider>
        </CreateModalProvider>
        </EditModalProvider>
    </CalendarContextProvider>
  );
};

export default Home;
