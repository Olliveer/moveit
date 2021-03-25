import axios from 'axios'
import { ObjectId } from 'bson'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getSession, useSession } from 'next-auth/client'
import { FormEvent, useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import ToastAnimated, { showToast } from '../components/Toast'
import styles from '../styles/pages/Profile.module.css'
import { connectToDatabase } from '../util/mongodb'

export default function Profile(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [session, loading] = useSession()
  const [id] = useState(props.user._id);
  const [name, setName] = useState(props.user.name);
  const [email, setEmail] = useState(props.user.email)
  const [edit, setEdit] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    axios.post('api/profile/profile', {
      id,
      name,
      email
    }).then(res => showToast({type: 'default', message: res.data.message })).catch().finally(() => setEdit(false))
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
                <input
                  id="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)} />

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
                <h3>{props.user.position.level}</h3>
                <h1>Desafios</h1>
                <p><span>{props.user.position.challengesCompleted}</span> completados</p>
                <h1>experiência</h1>
                <p><span>{props.user.position.totalExperience}</span> xp</p>
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
                <button onClick={() =>  setEdit(true)}>
                  Editar
                </button>
              </div>

              <div>
                <h3>{props.user.position.level}</h3>
                <h1>Desafios</h1>
                <p><span>{props.user.position.challengesCompleted}</span> completados</p>
                <h1>experiência</h1>
                <p><span>{props.user.position.totalExperience}</span> xp</p>
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
  const db = await connectToDatabase();

  const session = await getSession(ctx);

  if (!session) {
    ctx.res.writeHead(307, { Location: '/' });
    ctx.res.end();
    return { props: {} }
  }

  const user = await db.collection('users').findOne({ email: session.user.email });

  const inner = await db.collection('users').aggregate(
    [
      {
        $match: {
          _id: ObjectId(`${user._id}`)
        },
      },
      {
        $lookup: {
          from: 'rank',
          localField: '_id',
          foreignField: 'user_id',
          as: 'position',
        }
      },
      {
        $unwind: '$position'
      }
    ]
  ).sort({ currentExperience: -1 }).limit(100).toArray();

  const data = JSON.parse(JSON.stringify(inner));

  return {
    props: {
      user: data[0]
    }
  }
}