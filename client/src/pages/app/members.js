import Layout from '../../components/Layout';
import MembersInner from '../../components/MembersInner';
import NoSsr from '@mpth/react-no-ssr';
import PropTypes from 'prop-types';
import React from 'react';
import RequireAuth from '../../components/RequireAuth';

export default function Members(props) {
  return (
    <NoSsr>
      <Layout>
        <RequireAuth>
          <MembersInner organizationId={props['*']} />
        </RequireAuth>
      </Layout>
    </NoSsr>
  );
}

Members.propTypes = {
  '*': PropTypes.string.isRequired
};
