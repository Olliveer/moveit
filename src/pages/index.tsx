import { signIn, signOut, useSession } from 'next-auth/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { AiFillFacebook, AiFillTwitterCircle, AiOutlineArrowRight } from "react-icons/ai";
import ToastAnimated, { showToast } from '../components/Toast';
import styles from '../styles/pages/Index.module.css';


export default function Login(props) {
  const router = useRouter();
  const [session, loading] = useSession();
  const [email, setEmail] = useState('');
  const [loginError, setLoginError] = useState('')

  function handleLogin(event: FormEvent) {
    event.preventDefault();
    signIn('email', { email });
  }

  useEffect(() => {
    if (router.query.error) {
      setLoginError(String(router.query.error))
    }
  }, [router])
  
  if(loginError) {
   return showToast({ type: 'error', message: loginError })
  };

  return (
    <div className={styles.container}>
      <ToastAnimated />
      <section>
        <div>
          {/* <img src="logo-landing.svg" alt="Logo Move it" /> */}
        </div>

        {!session && (

          <div className={styles.buttonContainer}>
            <img src="logo.svg" alt="Logo" />
            <h1>Bem-vindo</h1>

            <div>
              <p>
                Faça login com seu Facebook ou Twitter
                para começar
              </p>
              <button onClick={() => signIn('facebook')}>
                <AiFillFacebook size={40} color="#FFF" />
              </button>

              <button onClick={() => signIn('twitter')}>
                <AiFillTwitterCircle size={40} color="#FFF" />
              </button>
            </div>

            <form onSubmit={handleLogin}>
              <input
                id="name"
                type="email"
                placeholder="Digite seu e-mail"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required />
              <button
                type="submit"
                style={
                  email ?
                    { background: '#4CD62B' }
                    : { borderColor: '#4953B8' }
                }
              >
                <AiOutlineArrowRight size={24} color='#FFF' />
              </button>
            </form>


          </div>

        )}
        {session && (
          <div className={styles.signedContainer}>
            <img src={session.user.image ?? 'user-placeholder.png'} alt="Profile Image" />
            <p>Você esta logado(a) como {session.user.name ?? session.user.email} </p>

            <div className={styles.signedButtons}>
              <button onClick={() => signOut()}>Sair</button>
              <Link href="/home">
                <button>Começar</button>
              </Link>
            </div>
          </div>
        )}
      </section>
      {loading && (
        <div>
          <h1>carregando</h1>
        </div>
      )}
    </div>

  )
}


