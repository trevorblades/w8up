import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';

export default function Layout(props) {
  return (
    <>
      <Helmet defaultTitle="Saucer" titleTemplate="%s - Saucer" />
      {props.children}
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
