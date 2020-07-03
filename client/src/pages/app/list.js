import Layout from '../../components/Layout';
import OrgInner from '../../components/OrgInner';
import PropTypes from 'prop-types';
import React from 'react';
import RequireAuth from '../../components/RequireAuth';

export default function List(props) {
  return (
    <Layout>
      <RequireAuth>
        <OrgInner organizationId={props['*']} />
      </RequireAuth>
    </Layout>
  );
}

List.propTypes = {
  '*': PropTypes.string.isRequired
};
