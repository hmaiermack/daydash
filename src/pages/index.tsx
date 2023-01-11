import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { CreateModalProvider } from "../context/CreateModalContext";
import { EventInteractionModalProvider } from "../context/EventInteractionModalContext";
import CalendarContainer from "../components/dayCalendar/CalendarContainer";
import { CalendarContextProvider } from "../context/CalendarContext";
import { EditModalProvider } from "../context/EditModalContext";
import HabitContainer from "../components/habits/HabitContainer";
import { useRouter } from "next/router";




const Home: NextPage = () => {
  const {status} = useSession()
  const router = useRouter()
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
            ) : (<>
              <span>you need to sign in</span>
              <button className="p-4 bg-blue-200" onClick={() => router.push("/api/auth/signin")}>go to sign in</button>
              <button className="p-4 bg-blue-200" onClick={() => router.push("/register")}>go to sign up</button>
              </>
              )}
            </div>
          </EventInteractionModalProvider>
        </CreateModalProvider>
        </EditModalProvider>
    </CalendarContextProvider>
  );
};

export default Home;
