import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link rel="apple-touch-icon" sizes="180x180" href="icons/favicon/apple-touch-icon.png" />
                    <link rel="icon" type="image/png" sizes="32x32" href="icons/favicon/favicon-32x32.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="icons/favicon/favicon-16x16.png" />
                    <link rel="manifest" href="icons/favicon/site.webmanifest" />
                    <link rel="mask-icon" href="icons/favicon/safari-pinned-tab.svg" color="#5bbad5" />
                    <meta name="msapplication-TileColor" content="#da532c" />
                    <meta name="theme-color" content="#ffffff" />

                    <meta property="twitter:card" content="summary_large_image" />
                    <meta property="twitter:url" content="https://metatags.io/" />
                    <meta property="twitter:title" content="Move.it | Level Up" />
                    <meta property="twitter:description" content="Técnica Pomodoro feito paraotimizar o tempo de estudos e tarefas geralmente é voltada para pessoas procrastinadoras, ou seja, que têm tendência a adiar suas atividades. " />
                    <meta property="twitter:image" content="https://i.imgur.com/IZSZ5xr.png"></meta>

                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Rajdhani:wght@600&display=swap" rel="stylesheet" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}