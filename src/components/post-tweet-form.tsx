import { useState } from "react";
import {styled} from "styled-components";
import { auth, db, storage } from "../firebase";
import { collection, addDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;
const TextArea = styled.textarea`
    border: 2px solid white;
    padding: 20px;
    border-radius: 20px;
    font-size: 16px;
    color: white;
    background-color: black;
    width: 100%;
    resize: none;
    &::placeholder{
        font-size: 16px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    &:focus{
        outline: none;
        border-color: #1d9bf0;
    }
`;
const AttachFileButton = styled.label`
    padding: 10px 0px;
    color: #1d9bf0;
    text-align: center;
    border-radius: 20px;
    border: 1px solid #1d9bf0;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;

`;
const AttachFileInput = styled.input`
    display: none;
`;
const SubmitBtn = styled.input`
    text-align: center;
    background-color: #1d9bf0;
    color: white;
    border: none;
    padding: 10px 0px;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
    &:hover,
    &:active{
        opacity: 0.8;
    }
`;
export default function PostTweetForm() {
    const [isLoading, setLoding] = useState(false);
    const [tweet, setTweet] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const onChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        setTweet(e.target.value);
    }
    // value랑 file의 이벤트는 다르다.
    const onFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target;
        // 여러파일이 아닌 하나의 파일만 체크
        if(files && files.length === 1){
            setFile(files[0]);
        }
    }

    // db에 글저장
    const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = auth.currentUser
        if(!user || isLoading || tweet === '' || tweet.length > 180){
            return;
        }

        try{
            setLoding(true);
            const doc = await addDoc(collection(db, 'tweets'), {
                tweet,
                createdAt: Date.now(),
                username : user.displayName || 'Anonymous',
                userId: user.uid,
            });
            if(file){
                // 주소를 찾는다.
                const locationRef = ref(storage,
                    `tweets/${user.uid}/${doc.id}`
                );
                // 바이트로업로드
                const result = await uploadBytes(locationRef,file);
                // 다운로드한다.
                const url = await getDownloadURL(result.ref);
                //업로드한 파일의 주소를 얻는다

                // 주소를 collection에 저장
                await updateDoc(doc, {
                    photo: url,
                });
            }
            setTweet('');
            setFile(null);
        }catch(e){
            console.log(e);
        }finally{
            setLoding(false);
        }
    };
    return (<Form onSubmit={onSubmit}>
        <TextArea required rows={5} maxLength={180} onChange={onChange} value={tweet} placeholder="What is happenning?"></TextArea>
        <AttachFileButton htmlFor="file">{file ? "Photo added " : "Add photo"}</AttachFileButton>
        <AttachFileInput onChange={onFileChange} type="file" id='file' accept="image/*"></AttachFileInput>
        <SubmitBtn type="submit" value={isLoading ? 'Posting...' : 'Post Tweet'}></SubmitBtn>
    </Form>);
}