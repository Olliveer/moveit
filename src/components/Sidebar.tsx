import { signOut } from 'next-auth/client';
import Link from 'next/link';
import {
  AiOutlineHome, AiOutlinePoweroff, AiOutlineTrophy, AiOutlineUser,
} from 'react-icons/ai';

import styles from '../styles/components/Sidebar.module.css';

export function Sidebar() {

  return (
    <aside className={styles.container}>
      <img src="logo-side.svg" alt="Move it Logo" />

      <div>
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

        <button>
          <AiOutlineTrophy size={32} />
        </button>
      </div>

      <footer>
        <button onClick={() => signOut()}>
          <AiOutlinePoweroff size={32} />
        </button>
      </footer>
    </aside>
  );
}
