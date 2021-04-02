import axios from 'axios';
import React, { FormEvent, useState } from 'react';
import { AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import swal from 'sweetalert';
import useSWR from 'swr';
import ToastAnimated, { showToast } from '../components/Toast';
import styles from '../styles/components/Challenges.module.css';

interface ChallengeProps {
  id: string;
  type: string;
  description: string;
  amount: number;
}

export default function Challenges() {
  const [list, setList] = useState(true);
  const [updateId, setUpdateId] = useState();
  const [add, setAdd] = useState(false);
  const [update, setUpdate] = useState(false);
  const [type, setType] = useState('')
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const notify = () => showToast({ type: 'warning', message: 'Preencha os campos para adicionar a atividade 😃' });

  const { data: listChallenges, mutate } = useSWR('api/challenges');

  if (!listChallenges) {
    return <div>Loading....</div>
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (type === '' || description === '' || amount === '') {
      notify();
    } else {
      axios.post('../api/challenges', {
        type,
        description,
        amount
      }).then(res => showToast({ type: 'default', message: res.data.message }))
        .catch(error => showToast({ type: 'error', message: error.response.data.message }))
        .finally(() => back())
    }
  }

  async function handleUpdate(event: FormEvent) {
    event.preventDefault();
    await axios.put('api/challenges/' + updateId, {
      id: updateId,
      type,
      description,
      amount,
    }).then(res => showToast({ type: 'default', message: res.data.message }))
      .catch(err => showToast({ type: 'error', message: err.response.data.message }))
      .finally(() => back());
  }

  function delChallenge(id: string) {
    swal({
      title: "Tem certeza que deseja excluír?",
      text: "Depois de excluído, você não será capaz de recuperar!",
      icon: "warning",
      buttons: ['Não', 'Sim'],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          axios.delete('api/challenges', {
            params: { id }
          }).then(() => back());
          swal("Poof! Your imaginary file has been deleted!", {
            icon: "success",
          });
        }
      })
  }

  async function editChallange(id: number) {
    await axios.get('api/challenges/' + id)
      .then(res => {
        setType(res.data.type);
        setDescription(res.data.description);
        setAmount(res.data.amount);
        setUpdateId(res.data.id);
      }).finally(() => editChallenge())
  }

  function editChallenge() {
    setAdd(false)
    setList(false)
    setUpdate(true)
  }

  function newChallenge() {
    setList(false);
    setAdd(true);
    setUpdate(false);
  }

  function back() {
    mutate();
    setAdd(false);
    setList(true);
    setUpdate(false);
    setType('');
    setDescription('');
    setAmount('');
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
              {listChallenges.map((challenge: ChallengeProps, index: number) => (
                <tr key={challenge.id}>
                  <td className={styles.UserContainer}>
                    <img src={(challenge.type === 'body') ? '/icons/body.svg' : '/icons/eye.svg'} alt="User Image" />

                  </td>
                  <td className={styles.tdDescription}><span>{challenge.description}</span></td>
                  <td><span>{challenge.amount}</span>XP</td>
                  <td>
                    <button onClick={() => delChallenge(challenge.id)}>
                      <BsTrash size={32} />
                    </button>
                    <button onClick={() => editChallange(Number(challenge.id))}>
                      <AiOutlineEdit size={32} />
                    </button>
                  </td>
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
      {update && (
        <div className={styles.ContentContainer}>
          <form onSubmit={handleUpdate}>
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