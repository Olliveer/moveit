import React from 'react';
import { signOut } from 'next-auth/client'

export default function Authenticated({ user }) {
  return (
    <div>
      <p>You are authenticated {user.name}</p>
      <h1>OLAAAAAAAAAA</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}