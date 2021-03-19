import Head from 'next/head'
// import styles from '../styles/pages/Login.module.css'
import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/client'

export default function Login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoginStarted, setIsLoginStarted] = useState(false)
  const [loginError, setLoginError] = useState('')
  const router = useRouter()
  

  const handleLogin = (e: FormEvent) => {
    e.preventDefault()
    setIsLoginStarted(true)
    signIn('credentials',
      {
        email,
        password,
        callbackUrl: `${window.location.origin}/home`
      }
    )
  }

  return (
    <div >
      <Head>
        <title>NextAuth Example</title>
      </Head>
      <main >
        <div >
          <h1>Welcome Back</h1>
          <form onSubmit={(e) => handleLogin(e)} >
            <label htmlFor='loginEmail'>Email</label>
            <input id='loginEmail' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            <span >{loginError}</span>
            <label htmlFor='inputPassword'>Password</label>
            <input id='inputPassword' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type='submit' disabled={isLoginStarted} >Log In</button>
          </form>
        </div>
      </main>
    </div>
  )
}