import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/CompleteChallanges.module.css';

export function CompleteChallanges() {
    const { challengesCompleted } = useContext(ChallengesContext);

    return (
        <div className={styles.completeChallangesContainer}>
            <span>Desafios completos</span>
            <span>{challengesCompleted}</span>
        </div>
    );
}