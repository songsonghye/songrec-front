import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Layout from "./Layout.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage.tsx";
import PlaylistDetail from "./pages/PlaylistDetail/PlaylistDetail.tsx";
import NotFound from "./pages/NotFound/NotFound.tsx";
import CommunityHome from "./pages/CommunityHome/CommunityHome.tsx";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "playlist/:playlistId",
        element: <PlaylistDetail />,
      },
      {
        path: "community",
        element: <CommunityHome />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
