import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
export const KeyboardAvoidingView = ({
  style,
  contentContainerStyle,
  ...props
}) => {
  const defaultProps = {
    style: {flex: 1, ...style},
    contentContainerStyle: {flexGrow: 1, ...contentContainerStyle},
    bounces: false,
    bouncesZoom: false,
    alwaysBounceVertical: false,
    alwaysBounceHorizontal: false,
    enableOnAndroid: true,
    keyboardShouldPersistTaps: 'handled',
    enableResetScrollToCoords: false,
  };

  return <KeyboardAwareScrollView {...defaultProps} {...props} />;
};
