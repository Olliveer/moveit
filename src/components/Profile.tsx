import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/Profile.module.css';


export function Profile({session}) { 
    const { level } = useContext(ChallengesContext);
    
    return (
        <div className={styles.profileContainer}>
            <img src={session.image || 'user-placeholder.png'} alt="eu" />
            <div>
                <strong>{session.name || session.email}</strong>
                <p>
                    <img src="icons/level.svg" alt="level" />
                    Level {level}
                </p>
            </div>
        </div>
    );
}