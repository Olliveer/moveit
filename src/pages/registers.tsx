import axios from 'axios';
import Head from 'next/head';
import { FormEvent, useState } from 'react';

export default function Home() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    function handleSignUp(event: FormEvent) {
        event.preventDefault();
        axios.post('/api/signup', { name, email, password });
    }

    return (
        <div>
            <Head>
                <title>NextAuth Example</title>
            </Head>
            <main>
                <h1>Welcome Back</h1>
                <form onSubmit={(e) => handleSignUp(e)}>
                    <label htmlFor='loginName'>Nome</label>
                    <input id='loginName' type='name' value={name} onChange={(e) => setName(e.target.value)} />

                    <label htmlFor='loginEmail'>Email</label>
                    <input id='loginEmail' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />

                    <label htmlFor='inputPassword'>Password</label>
                    <input id='inputPassword' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type='submit'>Log In</button>
                </form>

            </main>
        </div>

    );
}