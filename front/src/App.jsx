import { RouterProvider } from 'react-router-dom';

// routing
import router from 'routes';

import ThemeCustomization from 'themes';

// auth provider

// ==============================|| APP ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <>
        <RouterProvider router={router} />
      </>
    </ThemeCustomization>
  );
}
