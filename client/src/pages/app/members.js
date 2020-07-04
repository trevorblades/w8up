import Layout from '../../components/Layout';
import MembersInner from '../../components/MembersInner';
import PropTypes from 'prop-types';
import React from 'react';
import RequireAuth from '../../components/RequireAuth';

export default function Members(props) {
  return (
    <Layout>
      <RequireAuth>
        <MembersInner organizationId={props['*']} />
      </RequireAuth>
    </Layout>
  );
}

Members.propTypes = {
  '*': PropTypes.string.isRequired
};
