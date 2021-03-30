import { Switch } from '@material-ui/core';
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
  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [admin, setAdmin] = React.useState({
    checkedA: false,
    checkedB: true,
  });

  const { data: listAdm, mutate } = useSWR('api/users/admin');

  if (!listAdm) {
    return <div>Loding...</div>
  }

  const deleteUser = async (ref) => {
    await axios.delete('api/users/' + ref)
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

  function delAdmin(id: string) {
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

  function newUser() {
    setUseList(false)
    setUserAdd(true)
  }

  function back() {
    mutate()
    setUserAdd(false);
    setUseList(true);
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
              {listAdm.data.map((user: UserProps, index: number) => (
                <tr key={user.data.id}>
                  <td className={styles.UserContainer}>
                    <img src={user.data.image || '/user-placeholder.png'} alt="User Image" />
                    <div>
                      <p> {user.data.name ?? user.data.email}</p>
                    </div>

                  </td>
                  <td><span>{user.data.email}</span></td>
                  <td>
                    <button onClick={() => delAdmin(user.ref['@ref'].id)}>
                      <BsTrash size={32} />
                    </button>
                    <button>
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
    </div>
  )
}