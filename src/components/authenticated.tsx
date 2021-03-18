import React from 'react';
import { signOut } from 'next-auth/client'

export default function Authenticated({ user }) {
  return (
    <div>
      <button onClick={() => signOut}>Sign Out</button>
    </div>
  )
}