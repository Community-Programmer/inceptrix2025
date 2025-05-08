// router.tsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/Layout/MainLayout";
import RootWrapper from "@/Layout/RootWrapper";
import HomePage from "@/pages/Home/Home";

const mainLayoutRoutes = [
  {
    path: "/",
    index: true,
    element: <HomePage />,
  }
];


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootWrapper />, 
    children: [
     
      {
        path: "/",
        element: <MainLayout />,
        children: mainLayoutRoutes,
      }
    ],
  },
]);

export default router;
