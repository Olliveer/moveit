import Link from 'next/link';
import React from 'react'
import { AiOutlineOrderedList, AiOutlinePlus, AiOutlineUndo, AiOutlineUserAdd } from 'react-icons/ai';
import styles from '../styles/components/DashCards.module.css';
import { GiRun } from "react-icons/gi";

export default function DashCards({ totalUsers }) {
    return (
        <div className={styles.CardsContainer}>
            <div>
                <header>
                    <h1>Usários</h1>
                    <span>{totalUsers}</span>
                </header>
                <footer>
                    <Link href='beta/all'>
                        <button><AiOutlineUserAdd size={40} /></button>
                    </Link>
                    <button><AiOutlineOrderedList size={40} /></button>
                </footer>
            </div>
            <div>
            <header>
                    <h1>Admin</h1>
                    <span>{totalUsers}</span>
                </header>
                <footer>
                    <Link href='beta/users'>
                        <button><AiOutlineUserAdd size={40} /></button>
                    </Link>
                    <button><AiOutlineOrderedList size={40} /></button>
                </footer>
            </div>
            <div>
            <header>
                    <h1>Exercícios</h1>
                    <span>{totalUsers}</span>
                </header>
                <footer>
                    <Link href='beta/users'>
                        <button><AiOutlinePlus  size={40} /></button>
                    </Link>
                    <button><AiOutlineOrderedList size={40} /></button>
                </footer>
            </div>
            <div>
            <header>
                    <h1>Total XP</h1>
                    <span>{totalUsers}</span>
                </header>
                <footer>
                    <Link href='beta/users'>
                        <button><AiOutlineUndo size={40} /></button>
                    </Link>
                    <button><AiOutlineOrderedList size={40} /></button>
                </footer>
            </div>
        </div>
    )
}
