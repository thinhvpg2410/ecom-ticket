import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import Layout from "./components/Layout";
import RequireAdmin from "./components/RequireAdmin";
import DashboardPage from "./pages/DashboardPage";
import EventFormPage from "./pages/EventFormPage";
import EventsPage from "./pages/EventsPage";
import LoginPage from "./pages/LoginPage";
import UserFormPage from "./pages/UserFormPage";
import UsersPage from "./pages/UsersPage";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: <RequireAdmin />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "events", element: <EventsPage /> },
          { path: "events/new", element: <EventFormPage /> },
          { path: "events/:id/edit", element: <EventFormPage /> },
          { path: "users", element: <UsersPage /> },
          { path: "users/:id/edit", element: <UserFormPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
