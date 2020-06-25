import OrgSettingsForm, {ORG_DETAILS_FRAGMENT} from './OrgSettingsForm';
import PropTypes from 'prop-types';
import React from 'react';
import {ModalBody, Spinner, Text} from '@chakra-ui/core';
import {gql, useQuery} from '@apollo/client';

const GET_ORG_DETAILS = gql`
  query GetOrgDetails($id: ID!) {
    organization(id: $id) {
      phone
      ...OrgDetailsFragment
    }
  }
  ${ORG_DETAILS_FRAGMENT}
`;

export default function OrgSettingsModalContent({onCompleted, queryOptions}) {
  const {data, loading, error} = useQuery(GET_ORG_DETAILS, queryOptions);

  if (loading) {
    return (
      <ModalBody>
        <Spinner />
      </ModalBody>
    );
  }

  if (loading) {
    return (
      <ModalBody>
        <Text color="red.500">{error.message}</Text>
      </ModalBody>
    );
  }

  return (
    <OrgSettingsForm
      onCompleted={onCompleted}
      organization={data.organization}
    />
  );
}

OrgSettingsModalContent.propTypes = {
  queryOptions: PropTypes.object.isRequired,
  onCompleted: PropTypes.func.isRequired
};
