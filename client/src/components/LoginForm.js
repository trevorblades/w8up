import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Box, Button, Flex, Input, Stack, Text} from '@chakra-ui/core';
import {ReactComponent as Logo} from '../assets/logo.svg';

export default function LoginForm(props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const {username, password} = event.target;
    const basicAuth = `${username.value}:${password.value}`;

    setLoading(true);

    const response = await fetch(`${process.env.GATSBY_API_URL}/auth`, {
      headers: {
        Authorization: `Basic ${btoa(basicAuth)}`
      }
    });

    if (response.ok) {
      const token = await response.text();
      localStorage.setItem('sorrento:token', token);
      props.client.resetStore();
    } else {
      setError(response.statusText);
      setLoading(false);
    }
  }

  return (
    <Flex minH="100vh">
      <Box
        as="form"
        onSubmit={handleSubmit}
        autoComplete="off"
        m="auto"
        w="full"
        p="10"
        maxW={{md: 400}}
      >
        <Box as={Logo} h="12" mb="8" mx="auto" fill="current" />
        <Stack spacing="4">
          {error && <Text color="red.500">{error}</Text>}
          <Input
            size="lg"
            autoFocus
            required
            placeholder="Username"
            name="username"
          />
          <Input
            size="lg"
            required
            placeholder="Password"
            type="password"
            name="password"
          />
        </Stack>
        <Box textAlign="right" mt="6">
          <Button
            colorScheme="green"
            isLoading={loading}
            size="lg"
            ml="auto"
            type="submit"
          >
            Log in
          </Button>
        </Box>
      </Box>
    </Flex>
  );
}

LoginForm.propTypes = {
  client: PropTypes.object.isRequired
};
