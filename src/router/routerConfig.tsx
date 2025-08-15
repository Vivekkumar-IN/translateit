import { createBrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";
import Translate from "@/pages/Translate";
import NotFound from "@/pages/NotFound";
import { AppService } from "@/config/appService";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Index />,
    },
    {
      path: "/translate",
      element: <Translate />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
  {
    basename: AppService.DEPLOYMENT.BASE_PATH,
  },
);
