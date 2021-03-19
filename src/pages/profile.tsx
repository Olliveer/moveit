import { ObjectId } from 'bson'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getSession, useSession } from 'next-auth/client'
import { Sidebar } from '../components/Sidebar'
import { connectToDatabase } from '../util/mongodb'

import styles from '../styles/pages/Profile.module.css';
import { FormEvent, useContext, useState } from 'react'
import { ChallengesContext } from '../contexts/ChallengesContext'

interface UserProps {
  _id: string;
  name: string;
  email: string;
  image: string;
  position: {
    level: number;
    challengesCompleted: number;
    currentExperience: number;
    totalExperience: number;
  }
}

export default function Profile(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [session, loading] = useSession()
  const { challengesCompleted, level, totalExperience } = useContext(ChallengesContext);
  const [name, setName] = useState(props.user.name);
  const [email, setEmail] = useState(props.user.email)
  const [edit, setEdit] = useState(true);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
  }

  return (
    <div className={styles.Container}>
      <Sidebar />
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
              </div>

              <div>
                <h1>Desafios</h1>
                <p><span>{challengesCompleted}</span> completados</p>
                <h1>experiência</h1>
                <p><span>{totalExperience}</span> xp</p>
                <img src="share-logo.svg" alt="" />
              </div>

              <button type="submit">
                Atualizar
            </button>
            </section>
          ) : (
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
              </div>
              <div>
                <h1>Desafios</h1>
                <p><span>{challengesCompleted}</span> completados</p>
                <h1>experiência</h1>
                <p><span>{totalExperience}</span> xp</p>
                <img src="share-logo.svg" alt="" />
              </div>

              <button type="submit">
                Editar
            </button>
            </section>
          )}

        </form>
      </div>
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
  console.log('inner', inner)
  const data = JSON.parse(JSON.stringify(inner));

  return {
    props: {
      user: data[0]
    }
  }
}