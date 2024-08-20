import { collection,limit,onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";


export interface ITweet{
    id: string;
    photo: string;
    tweet: string;
    userId: string;
    username: string;
    createdAt: number;
}

const Wrapper = styled.div`
    display: flex;
    gap: 10px;
    flex-direction: column;
`;

export default function Timeline() {
    // 타입이 ITweet배열, 초기값은 빈 배열 
    const [tweets, setTweet] = useState<ITweet[]>([]);
    
    useEffect(() => {
        let unsubscribe : Unsubscribe | null = null;
        // 데이터베이스에서 가져오기
        const fetchTweets = async () => {
            const tweetsQuery = query(
                collection(db, 'tweets'),
                orderBy('createdAt', 'desc'),
                limit(25)
            );
            // 언마운트 : 컴포넌트가 dom에서 제거되는 것을 의미, 해당 컴포넌트와 관련된 모든 이벤트 리스너 등을 정리해준다.
            //onSnapshot : 실시간으로 데이터감지,
            //             이벤트리스너를 연결시켜 쿼리를 전달하기만하면됨
            //             반환값으로 unsubscribe를 반환 컴포넌트가 언마운트되면서 구독을 취소한다.
            unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
                const tweets = snapshot.docs.map(doc => {
                    const {tweet, createdAt, userId, username, photo} = doc.data();
                    // 인터페이스 요소를 전부 추가해줌
                    return {
                        tweet,
                        createdAt,
                        userId,
                        username,
                        photo,
                        id: doc.id,
                    };
                });
                setTweet(tweets);
            });
            
        }
        fetchTweets();
        return () => {
            //unsubscribe 함수가 존재할 경우에만 이를 호출
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            unsubscribe && unsubscribe();
        };
    }, []);
    return <Wrapper>
       {tweets.map(tweet => <Tweet key={tweet.id} {...tweet}></Tweet>)}
    </Wrapper>;
}