import { signIn, signOut, useSession } from 'next-auth/client'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { AiFillGithub, AiFillFacebook, AiOutlineArrowRight, AiFillTwitterCircle, AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import styles from '../styles/pages/Index.module.css';


export default function Login() {
  const router = useRouter();
  const [session, loading] = useSession();
  const [email, setEmail] = useState('');

  function handleLogin(event: FormEvent) {
    event.preventDefault();
    signIn('email', { email });
  }

  return (
    <div className={styles.container}>
      <section>
        <div>
          <img src="logo-landing.svg" alt="Logo Move it" />
        </div>

        {!session && (

          <div className={styles.buttonContainer}>
            <img src="logo.svg" alt="Logo" />
            <h1>Bem-vindo</h1>

            <div>
              <p>
                Faça login com seu Github ou Facebook
                para começar
              </p>
              <button onClick={() => signIn('facebook')}>
                <AiFillFacebook size={40} color="#FFF" />
              </button>

              <button onClick={() => signIn('github')}>
                <AiFillGithub size={40} color="#FFF" />
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
                }>
                <AiOutlineArrowRight size={24} color='#FFF' />
              </button>
            </form>


          </div>

        )}
        {session && (
          <div className={styles.signedContainer}>
            <img src={session.user.image} alt="Profile Image" />
            <p>Você esta logado(a) como {session.user.name} </p>

            <div className={styles.signedButtons}>
              <button onClick={() => signOut()}>Sair</button>
              <Link  href="/home">
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


