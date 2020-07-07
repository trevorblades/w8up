import Layout from '../components/Layout';
import React from 'react';
import {Box, Text} from '@chakra-ui/core';

export default function NotFound() {
  return (
    <Layout>
      <Box p={[5, 6]}>
        <Box mx="auto" maxW="container.lg">
          <Text>Not found</Text>
        </Box>
      </Box>
    </Layout>
  );
}
