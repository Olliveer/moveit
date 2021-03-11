import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/Profile.module.css';


export function Profile() {
    const [session, loading] = useSession();    
    const { level } = useContext(ChallengesContext);

    return (
        <div className={styles.profileContainer}>
            <img src={session.user.image || 'user-placeholder.png'} alt="eu" />
            <div>
                <strong>{session.user.name || session.user.email}</strong>
                <p>
                    <img src="icons/level.svg" alt="level" />
                    Level {level}
                </p>
            </div>
        </div>
    );
}