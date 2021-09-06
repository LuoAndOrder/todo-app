import Head from 'next/head'
import { Heading, Input, Button, Checkbox, Text, Code, Flex, Box } from "@chakra-ui/react";

import styles from '../styles/Home.module.css'

export default function Home() {
  const dummyTodoItems = [
    {
      id: 1,
      todo: 'foo',
    },
    {
      id: 2,
      todo: 'bar',
    },
    {
      id: 3,
      todo: 'baz',
    },
  ];

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

        {dummyTodoItems.map(item => <Checkbox>{item.todo}</Checkbox>)}
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