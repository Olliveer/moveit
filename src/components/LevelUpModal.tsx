import Head from 'next/head';
import { useContext } from 'react';
import { AiOutlineTwitter } from 'react-icons/ai';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/LevelUpModal.module.css';


export function LevelUpModal() {
  const { level, totalExperience, closeLevelUpModal } = useContext(ChallengesContext);
  return (
    <div className={styles.overlay}>
      <Head>
        <title>Move.it | Level Up</title>
      </Head>
      <div className={styles.container}>
        <header>{level}</header>
        <main>
          <strong>Parabéns</strong>
          <p>Você alcançou um novo level.</p>
        </main>
        <button type="button" className={styles.CloseButton} onClick={closeLevelUpModal}>
          <img src="/icons/close.svg" alt="Close Modal" />
        </button>
        <footer>
          <button
            type="button"
          >
            Compartilhar no twitter <AiOutlineTwitter size={24} />
          </button>
        </footer>
      </div>
    </div>
  );
}