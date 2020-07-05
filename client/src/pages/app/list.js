import Layout from '../../components/Layout';
import NoSsr from '@mpth/react-no-ssr';
import OrgInner from '../../components/OrgInner';
import PropTypes from 'prop-types';
import React from 'react';
import RequireAuth from '../../components/RequireAuth';

export default function List(props) {
  return (
    <NoSsr>
      <Layout>
        <RequireAuth>
          <OrgInner organizationId={props['*']} />
        </RequireAuth>
      </Layout>
    </NoSsr>
  );
}

List.propTypes = {
  '*': PropTypes.string.isRequired
};
