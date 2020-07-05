import Layout from '../../components/Layout';
import NoSsr from '@mpth/react-no-ssr';
import PropTypes from 'prop-types';
import React from 'react';
import RequireAuth from '../../components/RequireAuth';
import SettingsInner from '../../components/SettingsInner';

export default function Settings(props) {
  return (
    <NoSsr>
      <Layout>
        <RequireAuth>
          <SettingsInner organizationId={props['*']} />
        </RequireAuth>
      </Layout>
    </NoSsr>
  );
}

Settings.propTypes = {
  '*': PropTypes.string.isRequired
};
