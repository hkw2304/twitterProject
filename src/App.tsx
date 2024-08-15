import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import {useState, useEffect} from 'react';
import Layout from './components/layout';
import Home from './routes/home';
import Profile from './routes/profile';
import Login from './routes/login';
import CreateAccount from './routes/create-account';
import reset from 'styled-reset';
import LoadingScreen from './components/loading-screen';

const router = createBrowserRouter([
  {
    path:"/",
    element: <Layout></Layout>,
    children: [
      {
        path: "",
        element: <Home></Home>
      },
      {
        path: "profile",
        element: <Profile></Profile>
      }
    ],
  },
  {
    path: "login",
    element: <Login></Login>
  },
  {
    path: "create-account",
    element: <CreateAccount></CreateAccount>
  },
]);

const GlobalStyles = createGlobalStyle`
  ${reset};
  *{
    box-sizing: border-box;
  }
  body{
  background-color: black;
  color: white;
  font-family: 'system-ui', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

  }
`;



function App() {
  const [isLoading, setIsLoaing] = useState(true);
  const init = async () => {
    setTimeout(() => setIsLoaing(false), 2000);
  };
  useEffect(() => {
    init()
  }, []);

  return (
    <>
      <GlobalStyles></GlobalStyles>
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </>
  )
}

export default App
