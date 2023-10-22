import { useState, useEffect, useRef } from 'react';

import Messages from '@/components/Messages';
import Input from '@/components/Input';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Members from '@/components/Members';
import Script from 'next/script';
import TypingIndicator from '@/components/TypingIndicator';

let drone = null;

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [me, setMe] = useState({
    username: randomName(),
    color: randomColor(),
  });

  const messagesRef = useRef();
  messagesRef.current = messages;
  const membersRef = useRef();
  membersRef.current = members;
  const meRef = useRef();
  meRef.current = me;

  function connectToScaledrone() {
    drone = new window.Scaledrone('eAQKAxbEe4vitVw2', {
      data: meRef.current,
    });

    drone.on('open', (error) => {
      if (error) {
        return console.error(error);
      }
      meRef.current.id = drone.clientId;
      setMe(meRef.current);
    });

    const room = drone.subscribe('observable-room');

    room.on('message', (message) => {
      const { data, member } = message;
      if (typeof data === 'object' && typeof data.typing === 'boolean') {
        const newMembers = [...membersRef.current];
        const index = newMembers.findIndex((m) => m.id === member.id);
        newMembers[index].typing = data.typing;
        setMembers(newMembers);
      } else {
        setMessages([...messagesRef.current, message]);
      }
    });

    room.on('members', (members) => {
      setMembers(members);
    });

    room.on('member_join', (member) => {
      setMembers([...membersRef.current, member]);
    });
    room.on('member_leave', ({ id }) => {
      const index = membersRef.current.findIndex((m) => m.id === id);
      const newMembers = [...membersRef.current];
      newMembers.splice(index, 1);
      setMembers(newMembers);
    });

    if (drone === null) {
      connectToScaledrone();
    }
  }
  [];

  useEffect(() => {
    if (!drone) {
      connectToScaledrone();
    }
  }, [drone]);

  function randomName() {
    const adjectives = [
      'jesenji',
      'skriveni',
      'gorki',
      'magloviti',
      'tihi',
      'prazni',
      'suhi',
      'tamni',
      'ljetni',
      'ledeni',
      'delikatni',
      'tihi',
      'bijeli',
      'svježi',
      'proljetni',
      'zimski',
      'strpljivi',
      'sumračni',
      'grozni',
      'grimizni',
      'prhki',
      'iznošeni',
      'plavi',
      'valoviti',
      'slomljeni',
      'hladni',
      'vlaknasti',
      'padajući',
      'nježni',
      'zeleni',
      'dugi',
      'kasni',
      'daleki',
      'hrabri',
      'mali',
      'jutarnji',
      'blatni',
      'stari',
      'crveni',
      'grubi',
      'mirni',
      'mali',
      'sjajni',
      'stidljivi',
      'izgubljeni',
      'uvošteni',
      'divlji',
      'crni',
      'mladi',
      'sveti',
      'usamljeni',
      'mirisni',
      'stari',
      'zasnježeni',
      'ponosni',
      'cvijetni',
      'nemirni',
      'božanski',
      'fini',
      'drevni',
      'ljubičasti',
      'živahni',
      'bezimeni',
    ];
    const nouns = [
      'vodopad',
      'potok',
      'povjetarac',
      'mjesec',
      'slon',
      'vjetar',
      'krov',
      'miš',
      'snijeg',
      'desert',
      'sumrak',
      'bor',
      'mrak',
      'list',
      'oblak',
      'sjaj',
      'list',
      'brežuljak',
      'mačak',
      'konj',
      'učenik',
      'čistunac',
      'šaran',
      'potok',
      'leptir',
      'grm',
      'mrav',
      'čovjek',
      'mak',
      'plamen',
      'cvijet',
      'traktor',
      'pas',
      'tigar',
      'tepih',
      'lovor',
      'radio',
      'ribnjak',
      'daljinski',
      'pamflet',
      'zvuk',
      'vrisak',
      'jastuk',
      'oblik',
      'valjak',
      'grom',
      'kaktus',
      'kostur',
      'cvijet',
      'val',
      'šapat',
      'lovac',
      'dim',
      'parket',
      'san',
      'sok',
      'dječak',
      'čudak',
      'mraz',
      'glas',
      'papir',
      'planet',
      'dim',
      'kaput',
    ];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return adjective + ' ' + noun;
  }

  function randomColor() {
    return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
  }

  function onSendMessage(message) {
    if (drone) {
      drone.publish({
        room: 'observable-room',
        message,
      });
    } else {
      console.error('Drone not initialized.');
    }
  }

  function onChangeTypingState(isTyping) {
    drone.publish({
      room: 'observable-room',
      message: { typing: isTyping },
    });
  }

  return (
    <>
      <Head>
        <title>Scaledrone Chat App</title>
        <meta name='description' content='Mateas chat app!' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
        <script
          src='https://cdn.scaledrone.com/scaledrone-lite.min.js'
          type='text/javascript'
        />
      </Head>
      <main className={styles.app}>
        <div className={styles.appContent}>
          <Members members={members} me={me} />
          <Messages messages={messages} me={me} />
          <TypingIndicator
            members={members.filter((m) => m.typing && m.id !== me.id)}
          />
          <Input
            onSendMessage={onSendMessage}
            onChangeTypingState={onChangeTypingState}
          />
        </div>
      </main>
    </>
  );
}
