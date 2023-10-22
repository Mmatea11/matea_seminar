import Messages from '@/components/Messages';
import Input from '@/components/Input';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';

export default function Home() {
  function onSendMessage(message) {
    const newMessage = {
      data: message,
      member: me,
    };
    setMessages([...messages, newMessage]);
  }
  return (
    <>
      <Head>
        <title>Scaledrone Chat App</title>
        <meta name='description' content='Mateas chat app!' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.app}>
        <div className={styles.appContent}>
          <Messages messages={messages} me={me} />
          <Input onSendMessage={onSendMessage} />
        </div>
      </main>
    </>
  );
}
