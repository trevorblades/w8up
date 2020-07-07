import ChatBubble from '../components/ChatBubble';
import Layout from '../components/Layout';
import React from 'react';
import hero from '../assets/hero.svg';
import {Box, Button, Flex, Heading, Stack, Text} from '@chakra-ui/core';
import {Link as GatsbyLink} from 'gatsby';
import {Helmet} from 'react-helmet';
import {ReactComponent as Logo} from '../assets/logo.svg';

export default function Home() {
  return (
    <Layout>
      <Helmet>
        <title>Low tech, SMS-based waitlist</title>
      </Helmet>
      <Box maxW="container.lg" w="full" mx="auto" p={[8, 10, 12]}>
        <Stack spacing="10" align="center">
          <Flex align="center">
            <Box as={Logo} h="10" mr="3" fill="current" />
            <Heading fontSize="2xl" fontWeight="semibold" letterSpacing="wider">
              W8UP
            </Heading>
          </Flex>
          <Box as="img" w="420px" src={hero} />
          <Box textAlign="center">
            <Heading mb="2" fontSize="6xl" lineHeight="normal">
              A queue that anyone can use
            </Heading>
            <Heading color="gray.500" fontSize="2xl">
              It&apos;s simple: send a text, get on the list
            </Heading>
          </Box>
          <Stack maxW="320px" w="full" spacing="3">
            <ChatBubble>Ada Lovelace</ChatBubble>
            <ChatBubble fromThem>
              You&apos;re on the list! Your estimated wait time is 24 minutes.
            </ChatBubble>
          </Stack>
          <Flex align="center">
            <Button mr="3" as={GatsbyLink} to="/app" colorScheme="green">
              Log in
            </Button>
            <Text>This software is in closed beta</Text>
          </Flex>
        </Stack>
      </Box>
    </Layout>
  );
}
