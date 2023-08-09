import { CssBaseline, ThemeProvider } from '@mui/material';
import React, { useEffect } from 'react';
import './App.css';
import { createHashRouter, RouterProvider, Outlet } from "react-router-dom";
import { Home } from './components/home/Home';
import { PBError } from './components/PBError';
import { ChallengeById, ChallengeByName } from './components/ChallengeView';
import { BookView } from './components/book/BookView';
import { ImportedChallengeView } from './components/ImportedChallengeView';
import theme from './theme';
import "./theme-light.css"
import { About } from './components/about/About';
import { PasswordRecovery } from './components/PasswordRecovery';
import { Register } from './components/Register';
import { CreatorSelection } from './components/creator/Selection';
import { CreatorEditor } from './components/creator/Editor/Editor';
import { CreatorTryMode } from './components/creator/Editor/CreatorTryMode';
import { useLocation } from 'react-router-dom';
import ReactGA from "react-ga4";

const AnalyticsComponent = () => {
  const location = useLocation();
  
  useEffect(() => {
    if(ReactGA.isInitialized) {
      ReactGA.send({ hitType: "pageview", page: location.pathname});
    }
  }, [location])

  return <Outlet />
}

const router = createHashRouter([{
  element:<AnalyticsComponent/>, 
  children: [
  {
    path: "",
    element: <Home/>,
    errorElement: <PBError />
  },
  {
    path: "/libros/:id",
    element: <BookView/>,
    errorElement: <PBError />
  },
  {
    path: "/desafio/:id",
    element: <ChallengeById/>,
    errorElement: <PBError />
  },
  {
    path: "/desafios/:challengeName",
    element: <ChallengeByName />,
    errorElement: <PBError />
  },
  {
    path: "/desafioImportado",
    element: <ImportedChallengeView/>,
    errorElement: <PBError />
  },
  {
    path: "/acercade",
    element: <About/>
  },
  {
    path: "/password-recovery",
    element: <PasswordRecovery/>
  },
  {
    path: "/register",
    element: <Register/>
  },
  {
    path: "/creador/seleccionar",
    element: <CreatorSelection/>
  },
  {
    path: "/creador/editar",
    element: <CreatorEditor/>
  },
  {
    path: "/creador/probar",
    element: <CreatorTryMode/>
  }
]}]);


function App() {

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router}/>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;

