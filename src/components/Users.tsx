import { CircularProgress, Switch } from '@material-ui/core';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react';
import { AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import swal from 'sweetalert';
import useSWR from 'swr';
import styles from '../styles/components/Users.module.css';
import ToastAnimated, { showToast } from './Toast';

interface UserProps {
  ref: string;
  data: any;
  id: string;
  name: string;
  email: string;
  image: string;
}

export default function Users() {
  const router = useRouter();
  const [userList, setUseList] = useState(true);
  const [userAdd, setUserAdd] = useState(false);
  const [userUpdate, setUserUpdate] = useState(false);
  const [updateId, setUpdateId] = useState()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [admin, setAdmin] = React.useState({
    checkedA: false,
    checkedB: true,
  });
  
  const { data: listAdm, mutate } = useSWR('api/users/admin');

  if (!listAdm) {
    return (
      <div className={styles.Load}>
          <CircularProgress />
      </div>
  );
  }

  const deleteUser = async (id: number) => {
    await axios.delete('api/users/admin/' + id)
      .then(res => showToast({ type: 'success', message: res.data.message }))
      .finally(() => mutate());
  }


  const handleChange = (event) => {
    setAdmin({ ...admin, [event.target.name]: event.target.checked });
  };

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    axios.post('api/users/admin', {
      name,
      email,
      admin: admin.checkedB,
      createdAt: new Date().toLocaleString() + '',
    }).then(res => showToast({ type: 'default', message: res.data.message }))
      .catch(err => showToast({ type: 'error', message: err.response.data.message }))
      .finally(() => back());
  }

   function handleUpdate(id: number) {
     axios.put('api/users/admin/' + id, {
      id: updateId,
      name,
      email,
      isAdmin: admin.checkedB,
    }).then(res => showToast({ type: 'default', message: res.data.message }))
      .catch(err => showToast({ type: 'error', message: err.response.data.message }))
      .finally(() => back());
  }

  function delAdmin(id: number) {
    swal({
      title: "Tem certeza que deseja excluír?",
      text: "Depois de excluído, você não será capaz de recuperar!",
      icon: "warning",
      buttons: ['Não', 'Sim'],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          deleteUser(id).then(() => router.push('/beta'));
          swal("Poof! Your imaginary file has been deleted!", {
            icon: "success",
          });
        }
      })
  }

  async function editAdmin(id: number) {
    await axios.get('api/users/admin/' + id)
      .then(res => {
        setName(res.data.name)
        setEmail(res.data.email)
        setAdmin({checkedB: res.data.admin})
        setUpdateId(res.data.id)
      })
      .finally(() => updateAdmin());
  }

  function updateAdmin() {
    setUseList(false);
    setUserAdd(false);
    setUserUpdate(true);
  }

  function newUser() {
    setUseList(false);
    setUserAdd(true);
    setUserUpdate(false);
  }

  function back() {
    mutate()
    setUserAdd(false);
    setUseList(true);
    setUserUpdate(false);
    setName('');
    setEmail('');
  }

  return (
    <div className={styles.Container}>
      <ToastAnimated />
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
              {listAdm.map((user: UserProps, index: number) => (
                <tr key={user.id}>
                  <td className={styles.UserContainer}>
                    <img src={user.image || '/user-placeholder.png'} alt="User Image" />
                    <div>
                      <p> {user.name ?? user.email}</p>
                    </div>

                  </td>
                  <td><span>{user.email}</span></td>
                  <td>
                    <button onClick={() => delAdmin(Number(user.id))}>
                      <BsTrash size={32} />
                    </button>
                    <button onClick={() => editAdmin(Number(user.id))}>
                      <AiOutlineEdit size={32} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className={styles.ButtonAdd} onClick={newUser} ><AiOutlinePlus size={32} /></button>
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
      {userUpdate && (
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
                <button onClick={() => handleUpdate(updateId)}>
                  Atualizar
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