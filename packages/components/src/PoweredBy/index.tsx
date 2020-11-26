/** @jsx jsx */
import { jsx } from '@emotion/core';
import { __DEV__ } from '@sajari/react-sdk-utils';
import React from 'react';

import { LogoSajariColor, LogoSajariMono } from '../assets/logos';
import Box from '../Box';
import { useJustifyContent } from '../hooks';
import usePoweredByStyles from './styles';
import { PoweredByProps } from './types';

const PoweredBy = React.forwardRef((props: PoweredByProps, ref?: React.Ref<HTMLDivElement>) => {
  const { align = 'right', appearance } = props;
  const styles = usePoweredByStyles();
  const justifyContentStyles = useJustifyContent({ align });

  return (
    <Box ref={ref} css={[styles.container, justifyContentStyles]} {...props}>
      <Box as="span" css={styles.label}>
        Powered by
      </Box>
      {appearance === 'color' ? <LogoSajariColor css={styles.logo} /> : <LogoSajariMono css={styles.logo} />}
    </Box>
  );
});

if (__DEV__) {
  PoweredBy.displayName = 'PoweredBy';
}

export default PoweredBy;
export type { PoweredByProps };
