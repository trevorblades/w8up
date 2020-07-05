import PropTypes from 'prop-types';
import React from 'react';
import {Flex, Tab, TabList, Tabs} from '@chakra-ui/core';
import {Link as GatsbyLink} from 'gatsby';

export default function TabMenu({organization, ...props}) {
  return (
    <Tabs {...props} bg="gray.50" pt="1">
      <TabList>
        <Flex px={[0, 1]} w="full" maxW="container.lg" mx="auto">
          <Tab as={GatsbyLink} to={`/app/list/${organization.id}`}>
            Waitlist
          </Tab>
          <Tab as={GatsbyLink} to={`/app/settings/${organization.id}`}>
            Settings
          </Tab>
          <Tab as={GatsbyLink} to={`/app/members/${organization.id}`}>
            Members
          </Tab>
        </Flex>
      </TabList>
    </Tabs>
  );
}

TabMenu.propTypes = {
  organization: PropTypes.object.isRequired
};
