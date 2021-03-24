import React from 'react';
import { AiOutlineOrderedList, AiOutlinePlus, AiOutlineUndo, AiOutlineUserAdd } from 'react-icons/ai';
import styles from '../styles/components/DashCards.module.css';

export default function DashCards({ totalUsers,totalRank, totalChallenges, totalAdmins, set }) {

    function resetRank(){
        alert('resetar rank')
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
                    <h1>Exercícios</h1>
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
                    <button id="rank" onClick={resetRank}><AiOutlineUndo size={40} /></button>
                </footer>
            </div>
        </div>
    )
}


