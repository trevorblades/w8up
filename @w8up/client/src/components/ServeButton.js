import PropTypes from 'prop-types';
import React from 'react';
import {Button} from '@chakra-ui/core';
import {FaCheckCircle} from 'react-icons/fa';
import {SERVE_CUSTOMER} from '../utils';
import {useMutation} from '@apollo/client';

export default function ServeButton({mutationOptions}) {
  const [serveCustomer, {loading}] = useMutation(
    SERVE_CUSTOMER,
    mutationOptions
  );

  return (
    <Button
      borderRadius="full"
      leftIcon={<FaCheckCircle />}
      size="sm"
      isLoading={loading}
      onClick={serveCustomer}
    >
      Serve
    </Button>
  );
}

ServeButton.propTypes = {
  mutationOptions: PropTypes.object.isRequired
};
