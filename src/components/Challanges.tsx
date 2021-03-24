import axios from 'axios';
import React, { FormEvent, useState } from 'react';
import { AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import ToastAnimated, { showToast } from '../components/Toast';
import styles from '../styles/components/Challenges.module.css';

interface ChallengeProps {
  _id: string;
  type: string;
  description: string;
  amount: number;
}

export default function Challenges({challenges}) {
  const [list, setList] = useState(true);
  const [add, setAdd] = useState(false);
  const [ListChallenges] = useState(challenges);
  const [type, setType] = useState('')
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    axios.post('../api/challenges', {
      type,
      description,
      amount
    }).then(res => showToast({ type: 'default', message: res.data.message }))
      .catch(error => showToast({ type: 'error', message: error.message }))
      .finally(() => back())

  }

  function newChallenge() {
    setList(false)
    setAdd(true)
  }

  function back() {
    setAdd(false);
    setList(true);
  }

  return (
    <div className={styles.Container}>
      <ToastAnimated />
      <h1>Atividades</h1>
      {list && (
        <div className={styles.TableContainer}>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Descrição</th>
                <th>Amonut</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {ListChallenges.map((challenge: ChallengeProps, index: number) => (
                <tr key={challenge._id}>
                  <td className={styles.UserContainer}>
                    <img src={(challenge.type === 'body') ? '/icons/body.svg' : '/icons/eye.svg'} alt="User Image" />
                   
                  </td>
                  <td className={styles.tdDescription}><span>{challenge.description}</span></td>
                  <td><span>{challenge.amount}</span>XP</td>
                  <td><button><BsTrash size={32} /></button> <button><AiOutlineEdit size={32} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className={styles.ButtonAdd} onClick={newChallenge}><AiOutlinePlus size={32} /></button>
        </div>

      )}
      {add && (
        <div className={styles.ContentContainer}>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="type">Tipo</label>
              <input
                id="type"
                value={type}
                onChange={event => setType(event.target.value)}
                placeholder="body or eye"
              />

              <label htmlFor="description">descrição</label>
              <textarea
                id="description"
                rows={5}
                value={description}
                onChange={event => setDescription(event.target.value)}
              />

              <label htmlFor="amout">XP</label>
              <input
                id="amout"
                value={amount}
                type="number"
                onChange={event => setAmount(event.target.value)}

              />

              <div className={styles.ButtonsContainer}>
                <button type="submit">
                  Adicionar
              </button>
                <button onClick={() => back()}>
                  Voltar
              </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}


// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const db = await connectToDatabase(process.env.MONGODB_URI);

//   const session = await getSession(ctx);

//   if (!session) {
//     ctx.res.writeHead(307, { Location: '/' });
//     ctx.res.end();
//     return { props: {} }
//   }

//   const user = await db.collection('users').findOne({ email: session.user.email });
//   const totalUsers = await db.collection('users').countDocuments();
//   const rank = await db.collection('rank').countDocuments();
//   const challenges = await db.collection('challenges').find().toArray();

//   if (!user.admin) {
//     ctx.res.writeHead(307, { Location: '/' });
//     ctx.res.end();
//     return { props: {} }
//   }
//   const data = JSON.parse(JSON.stringify(challenges));

//   console.log(data)
//   return {
//     props: {
//       admin: user.admin,
//       totalUsers: totalUsers,
//       rank: rank,
//       challenges: data
//     }
//   }
// }