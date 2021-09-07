import Head from 'next/head'
import { Heading, Input, Button, Checkbox, Text, VStack, HStack, Flex } from "@chakra-ui/react";
import useSWR, { SWRConfig, useSWRConfig } from 'swr'
import { useState } from 'react';

import styles from '../styles/Home.module.css'

const API = 'http://localhost:3001';
const fetcher = (url) => fetch(url).then((res) => res.json());

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export async function getServerSideProps(context) {
  const todosResult = await fetcher(`${API}/todos`);

  return {
    props: {
      fallback: {
        [API]: todosResult
      }
    }
  }
}



function TodoList() {
  const { data } = useSWR(`${API}/todos`, fetcher);

  console.log('Is data ready?', !!data);

  if (!data) return <Text>Loading...</Text>
  return (
    <div>
      <VStack spacing={1} align="left">
        {data.map(item => 
          <Checkbox 
            key={item.id} 
            defaultChecked={item.completed}
            onChange={async (e) => {
              await postData(`${API}/todo/${item.id}`, { completed: e.target.checked });
            }}>
              {item.text}
          </Checkbox>)}
      </VStack>
    </div>
  )
}

export default function Home({ fallback }) {
  const [newItemText, setNewItemText] = useState('');

  const { mutate } = useSWRConfig();

  async function handleAddItem(text) {
    const result = await postData(`${API}/todo`, { text: text });
    console.log(result);
    setNewItemText('');
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading as="h1" size="2xl" mb="2">
          What needs to get done today?
        </Heading>

        <HStack spacing={1}>
          <Input placeholder="Todo Item"
            onChange={async (e) => {
              const { value } = e.currentTarget;
              setNewItemText(value);
            }}
            value={newItemText}/>
          <Button 
            colorScheme="blue"
            onClick={() => {
              handleAddItem(newItemText);
              mutate(`${API}/todos`, fetcher);
            }}>Add</Button>
        </HStack>

        <SWRConfig value={{ fallback }}>
          <TodoList />
        </SWRConfig>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}