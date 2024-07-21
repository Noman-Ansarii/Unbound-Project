import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Graph from "./components/Graph";
import POSTData from "./components/DataPOST";
import Graph2 from "./components/Graph2";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Graph2 />,
    },
    {
      path: "/graph",
      element: <Graph />,
    },
    {
      path: "/POSTData",
      element: <POSTData />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
