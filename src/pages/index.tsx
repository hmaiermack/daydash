import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { CreateModalProvider } from "../context/CreateModalContext";
import { EventInteractionModalProvider } from "../context/EventInteractionModalContext";
import CalendarContainer from "../components/dayCalendar/CalendarContainer";
import { CalendarContextProvider } from "../context/CalendarContext";
import { EditModalProvider } from "../context/EditModalContext";
import HabitContainer from "../components/habits/HabitContainer";
import { useRouter } from "next/router";
import Link from "next/link";
import { AppErrorBoundary } from "../components/general/AppErrorBoundary";




const Home: NextPage = () => {
  const {status} = useSession()
  return (
    <AppErrorBoundary>
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
              ) : (<div className="w-screen h-screen flex flex-col justify-center items-center">
                <span className="text-2xl">
                  Please <Link href="/auth/signin" ><a className="underline text-blue-500">sign in</a></Link> or <Link href="/auth/register" ><a className="underline text-blue-500">sign up</a></Link> to continue.
                </span>
                </div>
                )}
              </div>
            </EventInteractionModalProvider>
          </CreateModalProvider>
          </EditModalProvider>
      </CalendarContextProvider>
    </AppErrorBoundary>
  );
};

export default Home;
