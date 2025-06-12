
import { createBrowserRouter } from 'react-router-dom';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import { AppService } from '@/config/appService';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "*",
    element: <NotFound />,
  }
], {
  basename: AppService.DEPLOYMENT.BASE_PATH,
});
