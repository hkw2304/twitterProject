import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {auth} from '../firebase';
import { FirebaseError } from 'firebase/app';
import { Input, Switcher, Title, Wrapper, Form, Error } from '../components/auth-components';
import GithubButton from '../components/github-tn';


export default function CreateAccount() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState('');
    const onChange = (e : React.ChangeEvent<HTMLInputElement>) =>{
        const {target: {name, value}} = e;
        if(name === 'name'){
            setName(value);
        }else if(name === 'email'){
            setEmail(value);
        }else if(name === 'password'){
            setPassword(value);
        }
    };
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        console.log(`name : ${name} email : ${email} password : ${password}`);
        if(isLoading || name === "" || email === "" || password === "") return;
        
        try{
            setLoading(true);
            const credentials = await createUserWithEmailAndPassword(auth, email, password);
            console.log(credentials.user);
            await updateProfile(credentials.user, {
                displayName: name,
            });
            navigate('/');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
        }catch(e){
            if(e instanceof FirebaseError){
                setError(e.message);
            }
        }finally{
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