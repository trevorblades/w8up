import PropTypes from 'prop-types';
import React, {useMemo} from 'react';
import Timer from './timer';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  List,
  ListItem,
  Switch,
  Text
} from '@chakra-ui/core';
import {DarkButton, LOGO_HEIGHT, LOGO_MARGIN} from '../utils';
import {FaArrowRight} from 'react-icons/fa';
import {format} from 'date-fns';

function PanelHeading(props) {
  return (
    <Heading
      as="h3"
      fontSize="4xl"
      mb="6"
      textTransform="uppercase"
      {...props}
    />
  );
}

function PanelListItem({title, subtitle, children, ...props}) {
  return (
    <Flex as={ListItem} justify="space-between" align="center" {...props}>
      <div>
        <Text lineHeight="normal" fontSize="2xl" fontWeight="medium">
          {title}
        </Text>
        <Text lineHeight="normal" fontSize="xl">
          {subtitle}
        </Text>
      </div>
      <div>{children}</div>
    </Flex>
  );
}

PanelListItem.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired
};

function UserAvatar(props) {
  return <Avatar fontSize="sm" size="xs" {...props} />;
}

export default function AppInner(props) {
  const {customers, isAccepting} = props.data;

  const waitingCustomers = useMemo(
    () =>
      customers
        .filter(customer => !customer.servedAt)
        .sort((a, b) => new Date(a.waitingSince) - new Date(b.waitingSince)),
    [customers]
  );

  const servedCustomers = useMemo(
    () =>
      customers
        .filter(customer => customer.servedAt)
        .sort((a, b) => new Date(b.servedAt) - new Date(a.servedAt)),
    [customers]
  );

  function handleNextClick() {
    props.socket.emit('serve', {id: waitingCustomers[0].id});
  }

  function handleAcceptingChange(event) {
    if (
      event.target.checked ||
      confirm('Are you sure you want to stop accepting customers?')
    ) {
      props.socket.emit('accept', {value: event.target.checked});
    }
  }

  return (
    <Grid
      templateColumns={{
        base: '1fr',
        lg: 'repeat(2, 1fr)',
        xl: '2fr 1fr'
      }}
      flexGrow="1"
    >
      <Flex direction="column">
        <Box p="10" pt="0">
          <Flex
            h={LOGO_HEIGHT}
            my={LOGO_MARGIN}
            align="center"
            justify="flex-end"
          >
            <Text mr="2" as="label" htmlFor="accepting">
              Accepting customers
            </Text>
            <Switch
              display="flex"
              id="accepting"
              isChecked={isAccepting}
              onChange={handleAcceptingChange}
            />
            <UserAvatar ml="3" display={{lg: 'none'}} name={props.user.name} />
          </Flex>
          <PanelHeading>Waiting</PanelHeading>
          <List spacing="6">
            {waitingCustomers.map((customer, index) => (
              <PanelListItem
                key={customer.id}
                title={`${index + 1}. ${customer.name}`}
                subtitle={<Timer date={new Date(customer.waitingSince)} />}
              >
                <DarkButton
                  mr="3"
                  onClick={() => props.socket.emit('serve', {id: customer.id})}
                >
                  Serve
                </DarkButton>
                <Button
                  onClick={() => {
                    if (
                      confirm(
                        `Are you sure you want to remove "${customer.name}"?`
                      )
                    ) {
                      props.socket.emit('remove', {id: customer.id});
                    }
                  }}
                >
                  Remove
                </Button>
              </PanelListItem>
            ))}
          </List>
        </Box>
        <DarkButton
          mt="auto"
          w="full"
          rounded="none"
          h="100px"
          fontSize="3xl"
          position="sticky"
          bottom="0"
          textTransform="uppercase"
          rightIcon={FaArrowRight}
          disabled={!waitingCustomers.length}
          onClick={handleNextClick}
        >
          <span>
            Next{' '}
            <Box
              as="span"
              display={{
                display: 'none',
                md: 'inline'
              }}
            >
              customer
            </Box>
          </span>
        </DarkButton>
      </Flex>
      <Box
        h="100vh"
        position="sticky"
        top="0"
        flexDirection="column"
        px="10"
        bg="gray.50"
        display={{
          base: 'none',
          lg: 'flex'
        }}
      >
        <Flex h={LOGO_HEIGHT} my={LOGO_MARGIN} align="center">
          <UserAvatar mr="2" name={props.user.name} />
          Logged in as {props.user.name}
        </Flex>
        {servedCustomers.length ? (
          <>
            <PanelHeading>Served today</PanelHeading>
            <List spacing="6">
              {servedCustomers.map(customer => (
                <PanelListItem
                  key={customer.id}
                  title={customer.name}
                  subtitle={`Served by ${customer.barberName}`}
                >
                  <Text color="gray.500">
                    {format(new Date(customer.servedAt), 'p')}
                  </Text>
                </PanelListItem>
              ))}
            </List>
          </>
        ) : (
          <Box textAlign="center" m="auto">
            <Box fontSize="5xl">💈</Box>
            <Text fontSize="lg" color="gray.500">
              No customers have been served today
            </Text>
          </Box>
        )}
      </Box>
    </Grid>
  );
}

AppInner.propTypes = {
  socket: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};
