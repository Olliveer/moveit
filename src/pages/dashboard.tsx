import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getSession } from 'next-auth/client'
import React from 'react'
import { Sidebar } from '../components/Sidebar'
import { connectToDatabase } from '../util/mongodb'

export default function Dashboard(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    console.log(props.admin)
    return (
        <div>
            <Sidebar admin={props.admin} />
            <h1>{props.totalUsers}</h1>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const db = await connectToDatabase(process.env.MONGODB_URI);
  
    const session = await getSession(ctx);
  
    if (!session) {
      ctx.res.writeHead(307, { Location: '/' });
      ctx.res.end();
      return { props: {} }
    }
  
    const user = await db.collection('users').findOne({ email: session.user.email });
    const totalUsers = await db.collection('users').count();

    if(!user.admin){
        ctx.res.writeHead(307, { Location: '/' });
        ctx.res.end();
    }

    return {
        props: {
            admin: user.admin,
            totalUsers: totalUsers
        }
    }
}

// import { signIn } from 'next-auth/client';
// import { useRouter } from 'next/router';
// import { FormEvent, useContext, useEffect, useState } from 'react';
// import { ChallengesContext } from '../../contexts/ChallengesContext';
// import styles from '../../styles/pages/Login.module.css';

// export default function Login() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [isLoginStarted, setIsLoginStarted] = useState(false)
//   const [loginError, setLoginError] = useState('')
//   const router = useRouter()

//   const {admin} = useContext(ChallengesContext)
// console.log(admin)
//   useEffect(() => {
//     if (router.query.error) {
//       setLoginError(router.query.error)
//       setEmail(router.query.email)
//     }
//   }, [router])

//   function handleLogin(e: FormEvent) {
//     e.preventDefault()
//     setIsLoginStarted(true)
//     signIn('credentials',
//       {
//         email,
//         password,
//         callbackUrl: `${window.location.origin}/dashboard`
//       }
//     )
//   }

//   return (
//     <div className={styles.container}>
//       <main className={styles.loginMain}>
//         <div className={styles.loginStep}>
//           <h1>Welcome Back</h1>
//           <form onSubmit={handleLogin} className={styles.loginForm}>
//             <label htmlFor='loginEmail'>Email</label>
//             <input id='loginEmail' type='email' value={email} onChange={(e) => setEmail(e.target.value)} className={loginError ? styles.errorInput : ''} />
//             {/* <span className={styles.error}>{loginError}</span> */}
//             <label htmlFor='inputPassword'>Password</label>
//             <input id='inputPassword' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
//             <button type='submit' disabled={isLoginStarted} className={styles.blueButtonRound}>Log In</button>
//           </form>
//         </div>
//       </main>
//     </div>
//   )
// }