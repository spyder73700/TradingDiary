import Navbar1 from "./Navbar1";
import Trade from "./Trade";
import AIChatbox from "./AIChatbox";
import Add from "./Add";
import Home from"./Home";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Home /></>
    },
     {
      path: "/trade",
      element: <><Navbar1 /><Trade /></>
    },
    {
      path: "/ai-chatbox",
      element: <><Navbar1 /> <AIChatbox /></>
    },
    {
      path: "/add",
      element: <><Navbar1 /> < Add/></>
    },
  ])
  return (
      <>
      
    <RouterProvider router={router} />
    </>
  );
}

export default App;

