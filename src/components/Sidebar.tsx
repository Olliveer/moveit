import { signOut } from 'next-auth/client';
import Link from 'next/link';
import {
  AiOutlineHome, AiOutlinePoweroff, AiOutlineSetting, AiOutlineTrophy, AiOutlineUser
} from 'react-icons/ai';
import styles from '../styles/components/Sidebar.module.css';
import DarkModeToggle from './DarkModeToggle';


export function Sidebar({ admin = null }) {
  return (
    <aside className={styles.container}>
      <img src="/logo-side.svg" alt="Move it Logo" />

      <div className={styles.ButtonsContainer}>
        {admin ? (
          <>
            <Link href="/beta">
              <button>
                <AiOutlineSetting size={32} />
              </button>
            </Link>
            <Link href="/home">
              <button>
                <AiOutlineHome size={32} />
              </button>
            </Link>
            <Link href="/profile">
              <button>
                <AiOutlineUser size={32} />
              </button>
            </Link>
            <Link href="/leaderboards">
              <button>
                <AiOutlineTrophy size={32} />
              </button>
            </Link>

          </>
        ) : (
          <>
            <Link href="/home">
              <button>
                <AiOutlineHome size={32} />
              </button>
            </Link>
            <Link href="/profile">
              <button>
                <AiOutlineUser size={32} />
              </button>
            </Link>
            <Link href="/leaderboards">
              <button>
                <AiOutlineTrophy size={32} />
              </button>
            </Link>
          </>
        )}
        
      </div>

      <footer>        
      <DarkModeToggle />
        <button onClick={() => signOut()}>
          <AiOutlinePoweroff size={32} />
        </button>
      </footer>
    </aside>
  );
}
