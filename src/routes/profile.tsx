import styled from "styled-components";
import { auth, db, storage } from "../firebase"
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;
`;
const AvatarUpload = styled.label`
    width: 80px;
    overflow: hidden;
    height: 80px;
    border-radius: 50%;
    background-color: #1d9bf0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    svg{
        width: 50px;
    }
`;
const AvatarImg = styled.img`
    width: 100%;
`;
const AvatarInput = styled.input`
    display: none;    
`;
const Name = styled.span`
    font-size: 22px;
`;
const Tweets = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export default function Profile(){
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState(user?.photoURL);
    const [tweets,setTweets] = useState<ITweet[]>([]);
    const onAvatarChange =  async (e : React.ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target;
        if(!user) return;
        if(files && files.length === 1){
            const file = files[0];
            // 스토리지의 해당경로에 저장한다 알려줌
            const locationRef = ref(storage, `avatars/${user?.uid}`);
            // 해당경로에 업로드
            const result = await uploadBytes(locationRef, file);
            // 경로에있는 데이터 다운로드
            const avatarUrl = await getDownloadURL(result.ref);
            setAvatar(avatarUrl);
            await updateProfile(user, {
                photoURL:avatarUrl,
            });
        }
        setTweets(tweets);
    };

    // 해당 유저의 게시글만 가져오기
    const fetchTweets = async () => {
        const tweetQuery = query(
            collection(db, 'tweets'),
            where('userId', '==', user?.uid),
            orderBy('createdAt', 'desc'),
            limit(25),
        );
        // 문서에 쿼리를 넘겨준다.
        const snapshot = await getDocs(tweetQuery);
        const tweets = snapshot.docs.map(doc => {
            const {tweet, createdAt, userId, username, photo} = doc.data();
            return {
                tweet,
                createdAt,
                userId,
                username,
                photo,
                id: doc.id,
            };
        });
        setTweets(tweets);
    };
        useEffect(() => {
            fetchTweets();
        }, []);
    return <Wrapper>
        <AvatarUpload htmlFor='avatar'>
            {avatar ? 
            <AvatarImg src={avatar}></AvatarImg> : 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>}
        </AvatarUpload>
        <AvatarInput onChange={onAvatarChange} id="avatar" type="file" accept="image/*"></AvatarInput>
        <Name>
            {user?.displayName ?? 'Anonymous'}
        </Name>
        <Tweets>{tweets.map(tweet => <Tweet key={tweet.id} {...tweet}></Tweet>)}</Tweets>
    </Wrapper>
}