import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from "firebase/firestore";

// 파이어베이스 초기화
const firebaseConfig = {
  apiKey: "AIzaSyAb6YTdDq0xNed3XMZoRPMGkTmy0o0iM3I",
  authDomain: "twitterproject-65fd8.firebaseapp.com",
  projectId: "twitterproject-65fd8",
  storageBucket: "twitterproject-65fd8.appspot.com",
  messagingSenderId: "945550914117",
  appId: "1:945550914117:web:7dfaaa927f9e517b96e92c"
};

// 파이어페이스 초기화
const app = initializeApp(firebaseConfig);

//파이어베이스 인증정보 가져오기
export const auth = getAuth(app);
// storage : 저장소
export const storage = getStorage(app);
// 데이터베이스 : 저장소를 관리하기위함
export const db = getFirestore(app);

