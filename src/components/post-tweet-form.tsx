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
    // 내용 컬럼
    const [tweet, setTweet] = useState("");
    // 파일 컬럼
    const [file, setFile] = useState<File | null>(null);
    // textarea의 값에 대한 이벤트
    const onChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        setTweet(e.target.value);
    }
    // file의 값에 대한 이벤트
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
            // 업로드된 데이터가 저장되는 폴더 명과 파일 명을 지정할 수 있다.
            // 데이터베이스의 해당 컬랙션에 저장
            const doc = await addDoc(collection(db, 'tweets'), {
                // 컬럼들은 만들어서 추가
                tweet,
                createdAt: Date.now(),
                username : user.displayName || 'Anonymous',
                userId: user.uid,
            });
            if(file){
                // 업로드된 데이터가 저장되는 폴더 명과 파일 명을 지정할 수 있다.
                // 스토리지의 tweets의란폴더의 /uid/id 경로에 저장 
                const locationRef = ref(storage,
                    `tweets/${user.uid}/${doc.id}`
                );
                // 어디에 업로드를 할 것인가?
                const result = await uploadBytes(locationRef,file);
                // 다운로드한 주소
                const url = await getDownloadURL(result.ref);
                //업로드한 파일의 주소를 얻는다

                // 주소를 collection에 저장
                // doc : 업데이트하고싶은 db
                await updateDoc(doc, {
                    // 변경하고자하는 컬럼
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
    // label의 htmlFor과 input의 id로 연동
    return (<Form onSubmit={onSubmit}>
        <TextArea required rows={5} maxLength={180} onChange={onChange} value={tweet} placeholder="What is happenning?"></TextArea>
        <AttachFileButton htmlFor="file">{file ? "Photo added " : "Add photo"}</AttachFileButton>
        <AttachFileInput onChange={onFileChange} type="file" id='file' accept="image/*"></AttachFileInput>
        <SubmitBtn type="submit" value={isLoading ? 'Posting...' : 'Post Tweet'}></SubmitBtn>
    </Form>);
}