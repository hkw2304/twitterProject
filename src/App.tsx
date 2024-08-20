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

// 라우팅 설정
const router = createBrowserRouter([
  {
    // 최상위의 컴포넌트가 먼저 실행되고 자식 컴포넌트들이 실행
    // ProtectedRoute > Layout > Home && profile
    path:"/",
    element: 
    // ProtectedRoute 컴포넌트는 자식을 가진다, Layout컴포넌트는 자식으로 넘겨진다.
      <ProtectedRoute>
        <Layout></Layout>
      </ProtectedRoute>,
      // 자식으로 다른 컴포넌트를 가진다.
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
  // login, create-account 경로에는 layout을 적용하지않는다.
  {
    path: "login",
    element: <Login></Login>
  },
  {
    path: "create-account",
    element: <CreateAccount></CreateAccount>
  },
]);

/*
글로벌 css생성
모듈에 있는 reset임
*/ 
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
  // 파이어베이스에서 유저 정보들을 가져올 동안의 로딩 변수
  const [isLoading, setIsLoaing] = useState(true);
  const init = async () => {
    // 파이어베이스가 쿠키와 토큰을 읽고 백엔드와 소통해 로그인여부를 확인하는 중
    await auth.authStateReady();
    setIsLoaing(false);
  };
  useEffect(() => {
    init()
  }, []);

  // 로딩이 진행되는동안 LoadingScreen컴포넌트를 띄우고 완료 후 RouterProvider를 띄운다.
  return (
    <Wrapper>
      <GlobalStyles></GlobalStyles>
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  )
}

export default App
