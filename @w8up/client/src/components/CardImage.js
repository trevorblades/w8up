import PropTypes from 'prop-types';
import React, {useMemo} from 'react';
import amex from 'payment-icons/min/flat/amex.svg';
import defaultCard from 'payment-icons/min/flat/default.svg';
import discover from 'payment-icons/min/flat/discover.svg';
import mastercard from 'payment-icons/min/flat/mastercard.svg';
import visa from 'payment-icons/min/flat/visa.svg';
import {Box} from '@chakra-ui/core';

export default function CardImage({brand, ...props}) {
  const imageSrc = useMemo(() => {
    switch (brand) {
      case 'Visa':
        return visa;
      case 'MasterCard':
        return mastercard;
      case 'American Express':
        return amex;
      case 'Discover':
        return discover;
      default:
        return defaultCard;
    }
  }, [brand]);

  return <Box as="img" src={imageSrc} {...props} />;
}

CardImage.propTypes = {
  brand: PropTypes.string.isRequired
};
