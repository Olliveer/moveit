import Link from "next/link";
import { AiOutlineHome, AiOutlinePoweroff, AiOutlineTrophy, AiOutlineUser } from "react-icons/ai";

import styles from '../styles/components/Sidebar.module.css';



export function Sidebar() {
    return (
        <aside className={styles.container}>
            <img src="logo-side.svg" alt="Move it Logo" />

            <div>
                <Link href='/home'>
                    <button>
                        <AiOutlineHome size={32}  />
                    </button>
                </Link>
                <button>
                    <AiOutlineUser size={32}  />
                </button>

                <button>
                    <AiOutlineTrophy size={32}  />
                </button>
            </div>

            <footer>
                <button>
                    <AiOutlinePoweroff size={32} />
                </button>
            </footer>
        </aside>
    );
}