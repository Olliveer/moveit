import axios from 'axios'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getSession } from 'next-auth/client'
import { FormEvent, useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import ToastAnimated, { showToast } from '../components/Toast'
import styles from '../styles/pages/Profile.module.css'


export default function Profile(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [id] = useState(props.user.id);
  const [name, setName] = useState(props.user.name);
  const [email, setEmail] = useState(props.user.email)
  const [edit, setEdit] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    axios.post('api/profile', {
      id,
      name,
      email
    }).then(res => showToast({ type: 'default', message: res.data.message })).catch().finally(() => setEdit(false))
  }

  function back() {
    setEdit(false);
  }

  return (
    <div className={styles.Container}>
      <ToastAnimated />
      <Sidebar admin={props.user.admin} />
      <h1>Profile</h1>
      <div className={styles.FormContainer}>
        <form onSubmit={handleSubmit} className="edit-user-form">
          {edit ? (
            <section>
              <div>
                <img src={props.user.image ?? 'user-placeholder.png'} alt="User photo" />

                <label htmlFor="name">Nome</label>
                <input
                  id="name"
                  value={name}
                  onChange={event => setName(event.target.value)} />

                <label htmlFor="email">E-mail</label>
                <p>{email}</p>

                <div className={styles.ButtonsContainer}>
                  <button type="submit">
                    Atualizar
                </button>
                  <button onClick={() => back()}>
                    Voltar
                </button>
                </div>
              </div>

              <div>
                <h3>{props.user.rank.level}</h3>
                <h1>Desafios</h1>
                <p><span>{props.user.rank.challengesCompleted}</span> completados</p>
                <h1>experiência</h1>
                <p><span>{props.user.rank.totalExperience}</span> xp</p>
                <img src="share-logo.svg" alt="" />
              </div>
            </section>
          ) : (
            <section className={styles.Profile}>
              <div>
                <img src={props.user.image ?? 'user-placeholder.png'} alt="User photo" />
                <h1>Nome</h1>
                <p>{name}</p>

                <h1>E-mail</h1>
                <p>{email}</p>
                <button onClick={() => setEdit(true)}>
                  Editar nome
                </button>
              </div>

              <div>
                <h3>{props.user.rank.level}</h3>
                <h1>Desafios</h1>
                <p><span>{props.user.rank.challengesCompleted}</span> completados</p>
                <h1>experiência</h1>
                <p><span>{props.user.rank.totalExperience}</span> xp</p>
                <img src="share-logo.svg" alt="" />
              </div>
            </section>
          )}
        </form>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    ctx.res.writeHead(307, { Location: '/' });
    ctx.res.end();
    return { props: {} }
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const profile = await prisma.user.findUnique({
    where: {
      id: user.id
    },
    include: {
      rank: true
    }
  })

  return {
    props: {
      user: JSON.parse(JSON.stringify(profile))
    }
  }
}