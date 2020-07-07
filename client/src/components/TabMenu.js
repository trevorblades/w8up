import PropTypes from 'prop-types';
import React from 'react';
import {Flex, Tab, TabList, Tabs} from '@chakra-ui/core';
import {Link as GatsbyLink} from 'gatsby';

export default function TabMenu({tabs, pathname}) {
  return (
    <Tabs index={Object.values(tabs).indexOf(pathname)} bg="gray.50" pt="1">
      <TabList>
        <Flex px={[0, 1]} w="full" maxW="container.lg" mx="auto">
          {Object.entries(tabs).map(([key, value]) => (
            <Tab key={key} as={GatsbyLink} to={value}>
              {key}
            </Tab>
          ))}
        </Flex>
      </TabList>
    </Tabs>
  );
}

TabMenu.propTypes = {
  tabs: PropTypes.object.isRequired,
  pathname: PropTypes.string.isRequired
};
