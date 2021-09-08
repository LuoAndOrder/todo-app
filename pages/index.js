import Head from 'next/head'
import useSWR, { SWRConfig, useSWRConfig } from 'swr'
import { useState } from 'react';

import { Heading, Input, Button, IconButton, Checkbox, Text, VStack, HStack, Spacer, Flex } from "@chakra-ui/react";
import { DeleteIcon } from '@chakra-ui/icons';

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

async function httpDelete(url = '') {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

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
  const { mutate } = useSWRConfig();

  const [deleteIsLoading, setDeleteIsLoading] = useState({});

  console.log('Is data ready?', !!data);

  if (!data) return <Text>Loading...</Text>
  return (
    <div>
      <VStack spacing={1} align="left">
        {data.map((item) => 
          <HStack key={item.id} spacing={1}>
            <Checkbox 
              key={item.id} 
              defaultChecked={item.completed}
              onChange={async (e) => {
                await postData(`${API}/todos/${item.id}`, { completed: e.target.checked });
              }}>
                {item.text}
            </Checkbox>
            <Spacer />
            <IconButton
              isLoading={deleteIsLoading[item.id]}
              variant="ghost"
              aria-label="delete"
              icon={<DeleteIcon
                color="red.500" 
                onClick={async () => {
                  setDeleteIsLoading({ [item.id]: true });
                  await httpDelete(`${API}/todos/${item.id}`);
                  setDeleteIsLoading({ [item.id]: false});
                  mutate(`${API}/todos`, fetcher);
                }}
                />
              }
            />
          </HStack>
        )}
      </VStack>
    </div>
  )
}

export default function Home({ fallback }) {
  const [newItemText, setNewItemText] = useState('');
  const [isAddButtonLoading, setAddButtonLoading] = useState(false);

  const { mutate } = useSWRConfig();

  async function handleAddItem(text) {
    setAddButtonLoading(true);
    const result = await postData(`${API}/todos`, { text: text });
    console.log(result);
    setAddButtonLoading(false);
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
            isLoading={isAddButtonLoading}
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