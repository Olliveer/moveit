import { Switch } from '@material-ui/core';
import React, { FormEvent, useState } from 'react';
import { AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import styles from '../styles/components/Users.module.css';

interface UserProps {
  _id: string;
  name: string;
  email: string;
  image: string;
}

export default function Users({admins}) {
  const [userList, setUseList] = useState(true);
  const [userAdd, setUserAdd] = useState(false);
  const [adminList] = useState(admins);
  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [admin, setAdmin] = React.useState({
    checkedA: false,
    checkedB: true,
  });

  const handleChange = (event) => {
    setAdmin({ ...admin, [event.target.name]: event.target.checked });
  };

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
  }

  function newUser() {
    setUseList(false)
    setUserAdd(true)
  }

  function back() {
    setUserAdd(false);
    setUseList(true);
  }

  return (
    <div className={styles.Container}>
      <h1>Administradores</h1>
      {userList && (
        <div className={styles.TableContainer}>
          <table>
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Email</th>
                <th>editar</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((user: UserProps, index: number) => (
                <tr key={user._id}>
                  <td className={styles.UserContainer}>
                    <img src={user.image || '/user-placeholder.png'} alt="User Image" />
                    <div>
                      <p> {user.name ?? user.email}</p>
                    </div>

                  </td>
                  <td><span>{user.email}</span></td>
                  <td><button><BsTrash size={32} /></button> <button><AiOutlineEdit size={32} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className={styles.ButtonAdd} onClick={newUser}><AiOutlinePlus size={32} /></button>
        </div>

      )}
      {userAdd && (
        <div className={styles.ContentContainer}>
          <form onSubmit={handleSubmit} className="edit-user-form">
            <div>
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

              <label htmlFor="admin">Admin?</label>
              <Switch
                id="admin"
                checked={admin.checkedB}
                onChange={handleChange}
                color="primary"
                name="checkedB"
                inputProps={{ 'aria-label': 'primary checkbox' }}
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
//   const admins = await db.collection('users').find({ admin: true }).toArray();
// const data = JSON.parse(JSON.stringify(admins));
//   if (!user.admin) {
//     ctx.res.writeHead(307, { Location: '/' });
//     ctx.res.end();
//     return { props: {} }
//   }
//  
//   return {
//     props: {
//       admin: user.admin,
//       totalUsers: totalUsers,
//       rank: rank,
//       admins: data
//     }
//   }
// }