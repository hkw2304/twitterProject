import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 20px;
    border: 1px solid white;
    border-radius: 15px;
    margin-bottom: 10px;
`;

const Column = styled.div``;

const Photo = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 15px;
`;

const Username = styled.span`
    font-weight: 600;
    font-size: 15px;
`;

const Payload = styled.p`
    margin: 10px 0px;
    font-size: 18px;
`;

const DeleteBtn = styled.button`
    background-color: tomato;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
`;

export default function Tweet({username, photo, tweet, userId, id}: ITweet){
    const user = auth.currentUser;
    const onDelete = async () => {
        const ok = confirm('Are you sure you want to delete this tweet?');
        
        if(!ok || user?.uid !== userId) return;
        try{
            // 데이터베이스에서 해당 id를가진 데이터 삭제
            await deleteDoc(doc(db, 'tweets', id));
            // 스토리지에 첨부한 사진도 삭제
            if(photo){
                const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
                await deleteObject(photoRef);
            }
        }catch (e){
            console.log(e);
        }
    }
    return <Wrapper>
        <Column>
            <Username>{username}</Username>
            <Payload>{tweet}</Payload>
            {user?.uid === userId ? <DeleteBtn onClick={onDelete}>Delete</DeleteBtn> : null}
        </Column>
        {photo ? (<Column>
            <Photo src={photo}></Photo>
        </Column>) : null }
    </Wrapper>
}