import Layout from '../components/Layout';
import Members from '../components/Members';
import NoSsr from '@mpth/react-no-ssr';
import Organization from '../components/Organization';
import Organizations from '../components/Organizations';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import RequireAuth from '../components/RequireAuth';
import Settings from '../components/Settings';
import Waitlist from '../components/Waitlist';
import {Router} from '@reach/router';

export default function App(props) {
  return (
    <NoSsr>
      <Layout>
        <RequireAuth>
          <Router
            primary={false}
            component={Fragment}
            basepath="/app"
            location={props.location}
          >
            <Organizations path="/" />
            <Organization path="/:organizationId">
              <Waitlist path="/" />
              <Settings path="/settings" />
              <Members path="/members" />
            </Organization>
          </Router>
        </RequireAuth>
      </Layout>
    </NoSsr>
  );
}

App.propTypes = {
  location: PropTypes.object.isRequired
};
