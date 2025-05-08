// router.tsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/Layout/MainLayout";
import HomePage from "@/pages/Home/Home";
import LoginForm from "./pages/Login/Login";
import SignUpForm from "./pages/SignUp/SignUp";
import About from "./pages/About/About";
import Features from "./pages/Features/Features";
import Premium from "./pages/Premium/Premium";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import RootWrapper from "./Layout/RootWrapper";
import VerificationEmailSent from "./pages/EmailVerification/VerificationEmailSent";
import VerificationStatus from "./pages/EmailVerification/VerificationStatus";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import PasswordResetForm from "./pages/ForgotPassword/PasswordResetForm";

const mainLayoutRoutes = [
  {
    path: "/",
    index: true,
    element: <HomePage />,
  },
  {
    path: "/About",
    element: <About />,
  },
  {
    path: "/Features",
    element: <Features />,
  },
  {
    path: "/Premium",
    element: <Premium />,
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootWrapper />, 
    children: [
      {
        path: "/",
        element: <ProtectedRoute />, 
        children: [
          {
            path: "/Features",
            element: <Features/>,

          },
        ],
      },
      {
        path: "/",
        element: <MainLayout />,
        children: mainLayoutRoutes,
      },
      {
        path: "/Login",
        element: <LoginForm />,
      },
      {
        path: "/SignUp",
        element: <SignUpForm />,
      },
      {
        path: "/verifymail",
        element: <VerificationEmailSent />,
      },
      {
        path: "/verifymail/:verificationToken",
        element: <VerificationStatus />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password/:resetToken",
        element: <PasswordResetForm />,
      }
    ],
  },
]);

export default router;
