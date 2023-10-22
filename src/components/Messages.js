import { useEffect, useRef } from 'react';
import React from 'react';
import styles from '@/styles/Home.module.css';

export default function Messages({ messages, me }) {
  const bottomRef = useRef(null);
  useEffect(() => {
    if (bottomRef && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  });
  return (
    <ul className={styles.messagesList}>
      {messages.map((m) => Message(m, me))}
      <div ref={bottomRef}></div>
    </ul>
  );
}

function Message({ member, data, id }, me) {
  // 1
  const { username, color } = member.clientData;
  // 2
  const messageFromMe = member.id === me.id;
  const className = messageFromMe
    ? `${styles.messagesMessage} ${styles.currentMember}`
    : styles.messagesMessage;
  // 3
  return (
    <li key={id} className={className}>
      <span className={styles.avatar} style={{ backgroundColor: color }} />
      <div className={styles.messageContent}>
        <div className={styles.username}>{username}</div>
        <div className={styles.text}>{data}</div>
      </div>
    </li>
  );
}
/*This will render the JSX for each individual message as follows:
Each message is linked to a specific member (user), and every member is identified by an ID, username, avatar, and a personalized color.
Next, you check whether the message came from you or another user. This distinction is helpful because it allows us to display our own messages on the left side.
Finally, you construct JSX for the component. The JSX shows the user's avatar, their name, and the message's content, all stored inside the passed arguments.*/
