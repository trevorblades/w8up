import CardImage from './CardImage';
import PhoneNumbers from './PhoneNumbers';
import PropTypes from 'prop-types';
import React, {Fragment, useState} from 'react';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useTheme
} from '@chakra-ui/core';
import {CardElement, useElements, useStripe} from '@stripe/react-stripe-js';
import {LIST_ORGANIZATIONS, ORGANIZATION_FRAGMENT} from '../utils';
import {gql, useMutation} from '@apollo/client';
import {graphql, useStaticQuery} from 'gatsby';

const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      ...OrganizationFragment
    }
  }
  ${ORGANIZATION_FRAGMENT}
`;

export default function CreateOrganizationForm(props) {
  const stripe = useStripe();
  const elements = useElements();
  const {fonts, colors} = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [phoneNumbersLoaded, setPhoneNumbersLoaded] = useState(false);
  const [newCard, setNewCard] = useState(!props.defaultSource);

  const [createOrganization] = useMutation(CREATE_ORGANIZATION, {
    update(cache, result) {
      const data = cache.readQuery({query: LIST_ORGANIZATIONS});
      cache.writeQuery({
        query: LIST_ORGANIZATIONS,
        data: {
          ...data,
          organizations: [...data.organizations, result.data.createOrganization]
        }
      });
    }
  });

  const {allStripePlan} = useStaticQuery(
    graphql`
      {
        allStripePlan {
          nodes {
            id
            amount
            currency
            interval
          }
        }
      }
    `
  );

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);

    try {
      const {name, 'radio-phone': phone, 'radio-plan': plan} = event.target;
      const input = {
        name: name.value,
        phone: phone.value,
        plan: plan.value
      };

      const element = elements.getElement(CardElement);
      if (element) {
        const result = await stripe.createToken(element);

        if (result.error) {
          throw result.error;
        }

        input.source = result.token.id;
      }

      await createOrganization({variables: {input}});
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {React.createElement(
        props.wrapBody ? ModalBody : Fragment,
        undefined,
        <Stack spacing="4">
          {error && <Text color="red.500">{error.message}</Text>}
          <Input name="name" placeholder="Organization name" required />
          <FormControl>
            <FormLabel>Select a phone number</FormLabel>
            <PhoneNumbers
              limit={3}
              onCompleted={() => setPhoneNumbersLoaded(true)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Payment options</FormLabel>
            <RadioGroup defaultValue={allStripePlan.nodes[0].id} name="plan">
              <Stack>
                {allStripePlan.nodes.map(plan => (
                  <Radio key={plan.id} value={plan.id}>
                    ${plan.amount / 100} per {plan.interval}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </FormControl>
          {props.defaultSource && (
            <FormControl>
              <FormLabel>Payment method</FormLabel>
              <RadioGroup
                value={newCard.toString()}
                onChange={value => setNewCard(value === 'true')}
              >
                <Stack>
                  <Radio value="false">
                    <Flex align="center">
                      <CardImage
                        h="6"
                        mr="2"
                        brand={props.defaultSource.brand}
                      />
                      <Text
                        fontFamily="mono"
                        textTransform="uppercase"
                        letterSpacing="wider"
                      >
                        xxxx xxxx xxxx {props.defaultSource.last4}
                      </Text>
                    </Flex>
                  </Radio>
                  <Radio value="true">Add new card</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          )}
          {newCard && (
            <Box w="full" px="4" bg="white" borderRadius="md" borderWidth="1px">
              <CardElement
                options={{
                  style: {
                    base: {
                      lineHeight: '38px',
                      fontFamily: fonts.body,
                      fontSize: '16px',
                      color: colors.gray[800],
                      '::placeholder': {
                        color: colors.gray[400]
                      }
                    }
                  }
                }}
              />
            </Box>
          )}
        </Stack>
      )}
      {props.renderButton({
        isDisabled: !stripe || !phoneNumbersLoaded,
        isLoading: loading,
        type: 'submit',
        children: 'Create organization'
      })}
    </form>
  );
}

CreateOrganizationForm.propTypes = {
  defaultSource: PropTypes.object,
  renderButton: PropTypes.func.isRequired,
  wrapBody: PropTypes.bool
};
