import Head from 'next/head'
import useSWR, { SWRConfig, useSWRConfig } from 'swr'
import { useState } from 'react';

import { Heading, Input, Button, IconButton, Checkbox, Text, VStack, HStack, Spacer, Skeleton, Flex } from "@chakra-ui/react";
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

function TodoList({ data }) {
  const { mutate } = useSWRConfig();

  const [deleteIsLoading, setDeleteIsLoading] = useState({});

  if (!!data === false) {
    return (
      <VStack spacing={1}>
        <Skeleton height="20px" />
      </VStack>
    )
  }

  // sort todos by most recent on top
  data.sort((a, b) => {
    if (a.id < b.id) return 1;
    if (a.id > b.id) return -1;
    return 0;
  });

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
              icon={<DeleteIcon color="red.500" />}
              onClick={async () => {
                setDeleteIsLoading({ [item.id]: true });
                await httpDelete(`${API}/todos/${item.id}`);
                setDeleteIsLoading({ [item.id]: false});
                mutate(`${API}/todos`);
              }}
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

  const { data } = useSWR(`${API}/todos`, fetcher);
  const { mutate } = useSWRConfig();

  async function handleAddItem(text) {
    setAddButtonLoading(true);
    const result = await postData(`${API}/todos`, { text: text });
    console.log(result);
    setAddButtonLoading(false);
    setNewItemText('');
    mutate(`${API}/todos`, [result.todo, ...data], false);
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

        <form>
          <HStack spacing={1}>
            <Input placeholder="Todo Item"
              onChange={async (e) => {
                const { value } = e.currentTarget;
                setNewItemText(value);
              }}
              value={newItemText}/>
            <Button
              type="submit"
              isLoading={isAddButtonLoading}
              colorScheme="blue"
              onClick={() => {
                handleAddItem(newItemText);
              }}>Add</Button>
          </HStack>
        </form>

        <SWRConfig value={{ fallback }}>
          <TodoList data={data} />
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