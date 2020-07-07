import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';

export default function Layout(props) {
  return (
    <>
      <Helmet defaultTitle="w8up" titleTemplate="%s - w8up" />
      {props.children}
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
