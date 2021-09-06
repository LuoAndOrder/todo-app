import Head from 'next/head'
import { Heading, Input, Button, Checkbox, Text, VStack, Code, Flex, Box } from "@chakra-ui/react";
import useSWR, { SWRConfig } from 'swr'

import styles from '../styles/Home.module.css'

const API = 'http://localhost:3001/todos';
const fetcher = (url) => fetch(url).then((res) => res.json());

export async function getServerSideProps(context) {
  const todosResult = await fetcher(API);

  return {
    props: {
      fallback: {
        [API]: todosResult
      }
    }
  }
}

function TodoList() {
  const { data } = useSWR(API, fetcher);

  console.log('Is data ready?', !!data);

  if (!data) return <Text>Loading...</Text>
  return (
    <div>
      <VStack spacing={1} align="left">
        {data.map(item => <Checkbox key={item.id} defaultChecked={item.completed}>{item.text}</Checkbox>)}
      </VStack>
    </div>
  )
}

export default function Home({ fallback }) {
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

        <Flex>
          <Input placeholder="Todo Item" />
          <Button colorScheme="blue">Add</Button>
        </Flex>

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