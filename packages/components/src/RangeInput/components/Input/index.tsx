/* eslint-disable jsx-a11y/label-has-associated-control */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useTextField } from '@react-aria/textfield';
import React from 'react';
import tw from 'twin.macro';

import useInputStyle, { UseInputStyleProps } from '../../../hooks/useInputStyles';
import { RangeInputInputProps } from './types';

const Input = (props: RangeInputInputProps) => {
  const ref = React.useRef<HTMLInputElement>(null);
  const { inputProps, labelProps } = useTextField({ ...props, type: 'number' }, ref);
  const styles = useInputStyle({ block: true, type: 'text', ...props } as UseInputStyleProps);
  const { label, min, max } = props;
  const widthStyles = { width: `${38 + max.toString().length * 12}px` };

  return (
    <React.Fragment>
      <label css={tw`sr-only`} {...labelProps}>
        {label}
      </label>
      <input css={[tw`form-input`, styles, widthStyles]} {...inputProps} min={min} max={max} ref={ref} />
    </React.Fragment>
  );
};

export default Input;
