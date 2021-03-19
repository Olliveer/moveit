import React from 'react';
import { useContext } from 'react';
import * as htmlToImage from 'html-to-image';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/ShareImage.module.css';

const ShareImage = () => {
    const { level, totalExperience, challengesCompleted } = useContext(ChallengesContext);
   
    // htmlToImage.toJpeg(document.getElementById('share-img'), { quality: 0.95 })
    //     .then(function (dataUrl) {
    //         var link = document.createElement('a');
    //         link.download = 'my-image-name.jpeg';
    //         link.href = dataUrl;
    //         link.click();
    //     });
    
    return (
        <div id='share-img' className={styles.container}>
            <section>
                <div>
                    <p>{level}</p>
                    <p>Avancei para o próximo level</p>
                </div>
                <div>
                    <h1>Desafios</h1>
                    <p><span>{challengesCompleted}</span> completados</p>
                    <h1>experiência</h1>
                    <p><span>{totalExperience}</span> xp</p>
                    <img src="share-logo.svg" alt="" />
                </div>
            </section>
        </div>
    );
}

export default ShareImage;