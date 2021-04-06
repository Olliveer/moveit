import { signOut } from 'next-auth/client';
import Link from 'next/link';
import {
  AiOutlineHome, AiOutlinePoweroff, AiOutlineSetting, AiOutlineTrophy, AiOutlineUser
} from 'react-icons/ai';
import styles from '../styles/components/Sidebar.module.css';


export function Sidebar({ admin = null }) {
  return (
    <aside className={styles.container}>
      <img src="/logo-side.svg" alt="Move it Logo" />

      <div>
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
        <button onClick={() => signOut()}>
          <AiOutlinePoweroff size={32} />
        </button>
      </footer>
    </aside>
  );
}
