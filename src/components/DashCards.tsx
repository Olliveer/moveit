import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';
import { AiOutlineOrderedList, AiOutlinePlus, AiOutlineUndo, AiOutlineUserAdd } from 'react-icons/ai';
import swal from 'sweetalert';
import styles from '../styles/components/DashCards.module.css';
import { showToast } from './Toast';

export default function DashCards({ totalUsers, totalRank, totalChallenges, totalAdmins, set }) {
  const router = useRouter();

  function resetRank() {
    swal({
      title: "Tem certeza que deseja resetar o rank?",
      text: "Depois do reset, você não será capaz de voltar!",
      icon: "warning",
      buttons: ['Não', 'Sim'],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          axios.put('api/rank')
            .then(res => showToast({ type: 'default', message: res.data.message }))
            .catch(err => showToast({ type: 'error', message: err.message }))
            .finally(() => router.push('/beta'))
          swal("Poof! O rank foi resetado!", {
            icon: "success",
          });
        }
      })
  }

  return (
    <div className={styles.CardsContainer}>
      <div>
        <header>
          <h1>Usários</h1>
          <span>{totalUsers}</span>
        </header>
        <footer>
          <button onClick={() => set('users')}><AiOutlineOrderedList size={32} /></button>
        </footer>
      </div>
      <div>
        <header>
          <h1>Admin</h1>
          <span>{totalAdmins}</span>
        </header>
        <footer>
          <button onClick={() => set('admin')}><AiOutlineUserAdd size={40} /></button>
        </footer>
      </div>
      <div>
        <header>
          <h1>Desafios</h1>
          <span>{totalChallenges}</span>
        </header>
        <footer>
          <button onClick={() => set('challenges')}><AiOutlinePlus size={40} /></button>
        </footer>
      </div>
      <div>
        <header>
          <h1>Rank</h1>
          <span>{totalRank}</span>
        </header>
        <footer>
          <button id="rank" onClick={() => resetRank()}><AiOutlineUndo size={40} /></button>
        </footer>
      </div>
    </div>
  )
}


