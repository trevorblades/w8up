import ChatBubble from '../components/ChatBubble';
import Layout from '../components/Layout';
import React from 'react';
import {Box, Button, Flex, Heading, Stack, Text} from '@chakra-ui/core';
import {Link as GatsbyLink} from 'gatsby';
import {ReactComponent as Logo} from '../assets/logo.svg';

export default function Home() {
  return (
    <Layout>
      <Flex minH="100vh">
        <Box
          w="full"
          p={{
            base: 8,
            md: 10
          }}
          my="auto"
        >
          <Stack
            spacing="10"
            w={{
              base: 'full',
              lg: 2 / 3
            }}
          >
            <div>
              <Flex mb="2" align="center">
                <Box as={Logo} h="10" mr="3" />
                <Heading fontSize="4xl" fontWeight="semibold">
                  Saucer
                </Heading>
              </Flex>
              <Heading fontSize="6xl" lineHeight="normal" fontWeight="light">
                Low tech, SMS-based waitlist
              </Heading>
            </div>
            <Stack maxW="300px" spacing="3">
              <ChatBubble>Stan Marsh</ChatBubble>
              <ChatBubble fromThem>
                You&apos;re on the list! Your estimated wait time is 24 minutes.
              </ChatBubble>
            </Stack>
            <Flex align="center">
              <Button
                mr="3"
                as={GatsbyLink}
                to="/app"
                size="lg"
                colorScheme="green"
              >
                Log in
              </Button>
              <Text fontSize="lg">This software is in beta</Text>
            </Flex>
          </Stack>
        </Box>
      </Flex>
    </Layout>
  );
}
