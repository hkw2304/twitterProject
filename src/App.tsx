import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { useState, useEffect} from 'react';
import { auth } from './firebase';
import Layout from './components/layout';
import Home from './routes/home';
import Profile from './routes/profile';
import Login from './routes/login';
import CreateAccount from './routes/create-account';
import reset from 'styled-reset';
import LoadingScreen from './components/loading-screen';
import styled from 'styled-components';
import ProtectedRoute from './components/protected-route';

const router = createBrowserRouter([
  {
    path:"/",
    element: 
      <ProtectedRoute>
        <Layout></Layout>
      </ProtectedRoute>,
    children: [
      {
        path: "",
        element: 
          <Home></Home>
        
      },
      {
        path: "profile",
        element: 
          <Profile></Profile>
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

// 모듈에 있는 reset임
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

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;

function App() {
  const [isLoading, setIsLoaing] = useState(true);
  const init = async () => {
    await auth.authStateReady();
    setIsLoaing(false);
  };
  useEffect(() => {
    init()
  }, []);

  return (
    <Wrapper>
      <GlobalStyles></GlobalStyles>
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  )
}

export default App
