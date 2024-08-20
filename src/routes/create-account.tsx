import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {auth} from '../firebase';
import { FirebaseError } from 'firebase/app';
import { Input, Switcher, Title, Wrapper, Form, Error } from '../components/auth-components';
import GithubButton from '../components/github-tn';


export default function CreateAccount() {
    const navigate = useNavigate();
    // 문구 변경을위한 로딩
    const [isLoading, setLoading] = useState(false);
    // input으로 받은 값을 저장
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState('');

    // input의 상태가 변하면 초기화해주기위한 함수
    const onChange = (e : React.ChangeEvent<HTMLInputElement>) =>{
        // 받은 name의 value값을 가져온다.
        const {target: {name, value}} = e;
        if(name === 'name'){
            setName(value);
        }else if(name === 'email'){
            setEmail(value);
        }else if(name === 'password'){
            setPassword(value);
        }
    };
    // form에서 submit을하면 실행
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        console.log(`name : ${name} email : ${email} password : ${password}`);
        if(isLoading || name === "" || email === "" || password === "") return;
        // 입력한 값이 제대로 들어오면 계정 추가
        try{
            // 계정이 추가되는동안은 로딩중 출력
            setLoading(true);
            // 계정 추가가되면 인증정보를 받는다.
            const credentials = await createUserWithEmailAndPassword(auth, email, password);
            console.log(credentials.user);
            await updateProfile(credentials.user, {
                displayName: name,
            });
            // 계정 등록 후 인덱스로 이동
            navigate('/');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
        }catch(e){
            if(e instanceof FirebaseError){
                setError(e.message);
            }
        }finally{
            // 진행 완료후 원래대로 돌린다.
            setLoading(false)
        }
    }
    return <Wrapper>
        <Title> Join X</Title>
        <Form onSubmit={onSubmit}>
            <Input onChange={onChange} name='name' value={name} placeholder='Name' type='text' required></Input>
            <Input onChange={onChange} name='email' value={email} placeholder='Email' type='email' required></Input>
            <Input onChange={onChange} name='password' value={password} placeholder='Password' type='password' required></Input>
            <Input type='submit' value={isLoading ? 'Loading' : 'Create Account'}></Input>
        </Form>
        {error !== '' ? <Error>{error}</Error> : null}
        <Switcher>
           Already hava an account?<Link to="/login">Log in &rarr;</Link>
        </Switcher>
        <GithubButton></GithubButton>
    </Wrapper>
}