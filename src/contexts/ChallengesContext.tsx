import axios from 'axios';
import Cookies from 'js-cookie';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { strict } from 'node:assert';
import { createContext, ReactNode, useEffect, useState } from 'react';
import challenges from '../../challenges.json';
import { LevelUpModal } from '../components/LevelUpModal';

interface Challenge {
    type: string;
    description: string;
    amount: number;
}

interface ChallengesContextData {
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    activeChallenge: Challenge;
    experienceToNextLevel: number;
    closeLevelUpModal: () => void;
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    completeChallenge: () => void;
}

interface User {
    name: string;
    email: string;
    image: string;
}

interface ChallengesProviderProps {
    children: ReactNode;
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    user: User;
    rank: {}
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengeProvider({ children, ...rest }: ChallengesProviderProps) {
    const [dataRank] = useState(rest.rank);
    const [level, setLevel] = useState(dataRank[0].level ?? 1);
    const [currentExperience, setCurrentExperience] = useState(dataRank[0].currentExperience ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(dataRank[0].challengesCompleted ?? 0);
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);
    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)
    const [name] = useState(rest.user.name);
    const [email] = useState(rest.user.email);

    function rank() {
        axios.post('api/rank/rank', {
            name,
            email,
            level,
            currentExperience,
            challengesCompleted,
        })
    }

    useEffect(() => {
        Notification.requestPermission();
    }, [])

    useEffect(() => {
        Cookies.set('level', String(level));
        Cookies.set('currentExperience', String(currentExperience));
        Cookies.set('challengesCompleted', String(challengesCompleted));
        rank();
    }, [level, currentExperience, challengesCompleted])

    function levelUp() {
        setLevel(level + 1);
        setIsLevelUpOpen(true);
    }

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge(challenge);

        new Audio('/notification.mp3').play();

        if (Notification.permission === 'granted') {
            new Notification('Novo desafio 🎉', {
                silent: true,
                icon: 'https://i.imgur.com/Q97YCwd.png',
                body: `Valendo ${challenge.amount}xp!`
            })
        }
    }

    function resetChallenge() {
        setActiveChallenge(null);
    }

    function completeChallenge() {
        if (!activeChallenge) {
            return;
        }

        const { amount } = activeChallenge;

        let finalExperience = currentExperience + amount;

        if (finalExperience >= experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }

    function closeLevelUpModal() {
        setIsLevelUpOpen(false);
    }

    return (
        <ChallengesContext.Provider value={
            {
                level,
                currentExperience,
                challengesCompleted,
                levelUp,
                startNewChallenge,
                activeChallenge,
                resetChallenge,
                experienceToNextLevel,
                completeChallenge,
                closeLevelUpModal
            }}>
            {children}

            {isLevelUpOpen && <LevelUpModal />}
        </ChallengesContext.Provider>
    );
}