import { signIn } from 'next-auth/client';

export default function Unauthenticated() {
  function signIn() {
    signIn();
  }

  return (
    <div>
      <p>You are not authenticated</p>
      <button onClick={signIn}>Sign In</button>
    </div>
  );
}
