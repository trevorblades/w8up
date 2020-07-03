import PropTypes from 'prop-types';
import React from 'react';
import {Button} from '@chakra-ui/core';
import {gql, useMutation} from '@apollo/client';

const REMOVE_CUSTOMER = gql`
  mutation RemoveCustomer($id: ID!) {
    removeCustomer(id: $id) {
      id
    }
  }
`;

export default function RemoveButton({customer, ...props}) {
  const [removeCustomer, {loading}] = useMutation(REMOVE_CUSTOMER, {
    variables: {
      id: customer.id
    }
  });

  function handleClick() {
    if (confirm(`Are you sure you want to remove "${customer.name}"?`)) {
      removeCustomer();
    }
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      color="gray.500"
      borderRadius="full"
      isLoading={loading}
      onClick={handleClick}
      {...props}
    >
      Remove
    </Button>
  );
}

RemoveButton.propTypes = {
  customer: PropTypes.object.isRequired
};
