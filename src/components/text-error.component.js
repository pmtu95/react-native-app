import React from 'react';
import {StyleService, useStyleSheet, Text} from '@ui-kitten/components';

export const TextError = ({style, ...props}) => {
  const styles = useStyleSheet(themedStyle);
  return <Text style={{...styles.textError, ...style}} {...props} />;
};

const themedStyle = StyleService.create({
  textError: {
    fontSize: 14,
    color: 'text-danger-active-color',
  },
});
