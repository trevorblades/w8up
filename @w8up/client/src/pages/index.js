import ChatBubble from '../components/ChatBubble';
import Header from '../components/Header';
import Layout from '../components/Layout';
import React from 'react';
import balloons from '../assets/balloons.svg';
import stability from '../assets/stability.svg';
import {Box, Button, Flex, Grid, Heading, Stack, Text} from '@chakra-ui/core';
import {Link as GatsbyLink} from 'gatsby';
import {Helmet} from 'react-helmet';

export default function Home() {
  return (
    <Layout>
      <Helmet>
        <title>SMS-based waitlist</title>
      </Helmet>
      <Header>
        <Heading fontSize="2xl" fontWeight="semibold">
          W8UP
        </Heading>
      </Header>
      <Grid
        p={[8, 10, 12, 16]}
        gap="10"
        templateColumns="repeat(2, 1fr)"
        alignItems="center"
        maxW="container.xl"
        mx="auto"
      >
        <Box>
          <Heading mb="3" fontSize="6xl" lineHeight="normal">
            The queue that <mark>anyone</mark> can use
          </Heading>
          <Heading mb="6" color="gray.500" fontSize="3xl">
            Send a text, get on the list
          </Heading>
          <Flex align="center">
            <Button
              mr="6"
              size="lg"
              as={GatsbyLink}
              to="/app"
              colorScheme="green"
            >
              Log in
            </Button>
            <Text fontSize="lg">Invite-only beta</Text>
          </Flex>
        </Box>
        <Box as="img" src={stability} h="400px" objectFit="contain" />
      </Grid>
      <Box bg="gray.900">
        <Grid
          gap="10"
          templateColumns="repeat(2, 1fr)"
          maxW="container.xl"
          w="full"
          mx="auto"
          alignItems="center"
          px={[8, 10, 12, 16]}
        >
          <Box pb={[8, 10, 12, 16]}>
            <Box
              w="full"
              h="400px"
              as="img"
              src={balloons}
              my="-48px"
              objectFit="contain"
            />
            <Stack mx="auto" maxW="320px" w="full" spacing="3">
              <ChatBubble occlusionColor="gray.900">Sophie L.</ChatBubble>
              <ChatBubble occlusionColor="gray.900" fromThem>
                You&apos;re on the list! There are 4 people ahead of you. Your
                estimated wait time is 20 minutes.
              </ChatBubble>
              <ChatBubble occlusionColor="gray.900" fromThem>
                We&apos;re ready! Please head over to the store now.
              </ChatBubble>
            </Stack>
          </Box>
          <Box py={[8, 10, 12, 16]} color="white">
            <Heading mb="6" fontSize="5xl" lineHeight="normal">
              Low-tech, SMS-based waitlist
            </Heading>
            <Stack spacing="4" fontSize="xl">
              <Text>
                W8UP is a service that allows business owners to set up and
                maintain a fully-automated SMS-based waitlist.
              </Text>
              <Text>
                A customer sends a text message with their name to your unique
                phone number, and they&apos;re automatically added to your list.
                W8UP sends a fully customizable, automated reply back to the
                customer with their estimated wait time and position in line.
              </Text>
              <Text>
                When you&apos;re ready to serve the next customer, a
                customizable text message is sent to them to let them know that
                it&apos;s their turn.
              </Text>
            </Stack>
          </Box>
        </Grid>
        <Box as="footer" p={[4, 5]} textAlign="center">
          <Text color="gray.500">&copy; {new Date().getFullYear()} W8UP</Text>
        </Box>
      </Box>
    </Layout>
  );
}
