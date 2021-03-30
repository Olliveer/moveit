import axios from 'axios';
import { GetServerSideProps } from 'next';
import { createContext, ReactNode, useEffect, useState } from 'react';
import challenges from '../../challenges.json';
import { LevelUpModal } from '../components/LevelUpModal';
import { connectToDatabase } from '../util/mongodb';

interface Challenge {
    type: string;
    description: string;
    amount: number;
}

interface ChallengesContextData {
    level: number;
    currentExperience: number;
    totalExperience: number;
    challengesCompleted: number;
    activeChallenge: Challenge;
    experienceToNextLevel: number;
    closeLevelUpModal: () => void;
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    completeChallenge: () => void;
}

interface UserRank {
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    totalExperience: number;
}

interface User {
    id: string;
    name: string;
    email: string;
    image: string;
}

interface ChallengesProviderProps {
    children: ReactNode;
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    session: User;
    user: User;
    rank: UserRank;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengeProvider({ children, ...rest }: ChallengesProviderProps) {
    const [level, setLevel] = useState(rest.rank.level ?? 1);
    const [currentExperience, setCurrentExperience] = useState(rest.rank.currentExperience ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.rank.challengesCompleted ?? 0);
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);
    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)
    const [totalExperience, setTotalExperience] = useState(rest.rank.totalExperience ?? 0);
    const [id] = useState(rest.user.id);

    useEffect(() => {
        Notification.requestPermission();
    }, [])

    useEffect(() => {
        axios.post('api/rank', {
            userID: id,
            level,
            currentExperience,
            challengesCompleted,
            totalExperience,
        })
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
        setTotalExperience(amount + totalExperience)
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
                totalExperience,
                levelUp,
                startNewChallenge,
                activeChallenge,
                resetChallenge,
                experienceToNextLevel,
                completeChallenge,
                closeLevelUpModal,
            }}>
            {children}

            {isLevelUpOpen && <LevelUpModal />}
        </ChallengesContext.Provider>
    );
}