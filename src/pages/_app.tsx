
import { Provider } from 'next-auth/client';
import DarkModeToggle from '../components/DarkModeToggle';
import '../styles/global.scss';

export default function App({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}
      options={{
        clientMaxAge: 0,     // Re-fetch session if cache is older than 60 seconds
        keepAlive: 0 // Send keepAlive message every 5 minutes
      }}
    >       
      <Component {...pageProps} />
    </Provider>
  )
}

