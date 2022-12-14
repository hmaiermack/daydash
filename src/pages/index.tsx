import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import useWindowSize from "../hooks/useWindowSize";
import { Controller, useForm } from "react-hook-form";
import Testing from "../components/dayCalendar/Testing";
import ColorPicker from "../components/dayCalendar/ColorPicker";
import { CreateModalProvider } from "../context/modalContext";
import EventInteractionModal from "../components/dayCalendar/EventInteractionModal";
import { EventInteractionModalProvider } from "../context/EventInteractionModalContext";




const Home: NextPage = () => {
  const [date, setDate] = useState(new Date)
  // const getTasks = trpc.useQuery(["tasks.tasks", {date}]);
  const { register, handleSubmit, watch, formState: { errors }, control } = useForm();

  const {width} = useWindowSize()



  return (
    <CreateModalProvider>
      <EventInteractionModalProvider>

        <div>
        {/* <ColorPicker name="test" control={control}/> */}
          <button onClick={()=> signIn()} className="mx-4">Sign in</button>
        {/* {width && 
          <Table screenWidth={width}/>
        } */}
        <EventInteractionModal />
        <Testing />

        <div className="w-full h-40 bg-green-400 mt-5"></div>
        </div>
      </EventInteractionModalProvider>
    </CreateModalProvider>
  );
};

export default Home;
