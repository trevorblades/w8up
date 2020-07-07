import CreateOrganizationButton from './CreateOrganizationButton';
import PropTypes from 'prop-types';
import React from 'react';
import useEffectOnce from 'react-use/lib/useEffectOnce';
import {Badge, Box, Flex, Stack, Text} from '@chakra-ui/core';
import {FiArrowRight} from 'react-icons/fi';
import {Link as GatsbyLink} from 'gatsby';
import {ON_ORGANIZATION_UPDATED} from '../utils';

export default function OrganizationList({data, subscribeToMore}) {
  useEffectOnce(() => subscribeToMore({document: ON_ORGANIZATION_UPDATED}));
  return (
    <>
      <Stack mb="4">
        {data.organizations.map(organization => (
          <Flex
            align="center"
            justify="space-between"
            borderRadius="lg"
            p="3"
            borderWidth="1px"
            as={GatsbyLink}
            to={`/app/${organization.id}`}
            key={organization.id}
            _hover={{bg: 'gray.50'}}
            _active={{bg: 'gray.100'}}
          >
            <div>
              <Flex align="center">
                <Text fontWeight="medium">{organization.name}</Text>
                <Badge
                  ml="2"
                  colorScheme={organization.accepting ? 'green' : 'red'}
                >
                  {organization.accepting ? 'On' : 'Off'}
                </Badge>
              </Flex>
              <Text lineHeight="normal" fontSize="sm" color="gray.500">
                {organization.phone}
              </Text>
            </div>
            <Box as={FiArrowRight} fontSize="xl" mx="1" />
          </Flex>
        ))}
      </Stack>
      <CreateOrganizationButton defaultSource={data.me.defaultSource} />
    </>
  );
}

OrganizationList.propTypes = {
  data: PropTypes.object.isRequired,
  subscribeToMore: PropTypes.func.isRequired
};
