import Layout from '../../components/Layout';
import PropTypes from 'prop-types';
import React from 'react';
import RequireAuth from '../../components/RequireAuth';
import SettingsInner from '../../components/SettingsInner';

export default function Settings(props) {
  return (
    <Layout>
      <RequireAuth>
        <SettingsInner organizationId={props['*']} />
      </RequireAuth>
    </Layout>
  );
}

Settings.propTypes = {
  '*': PropTypes.string.isRequired
};
