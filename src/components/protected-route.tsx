import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({
    // 자식으로 컴포넌트를 선언
    children,
}: {
    children: React.ReactNode;
}) {
    // currentUser : 로그인한 유저를 가져온다.
    const user = auth.currentUser;
    if(user === null){
        //비로그인이면 login페이지로 이동시킨다.
        return <Navigate to="/login"></Navigate>
    }

    return children;
}