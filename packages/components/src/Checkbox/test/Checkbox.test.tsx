import { ThemeProvider } from '@sajari/react-sdk-utils';
import { render } from '@testing-library/react';
import React from 'react';

import Checkbox from '..';

describe('Checkbox', () => {
  it('Should call the onChange handler', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <ThemeProvider>
        <Checkbox onChange={onChange}>Suggestions</Checkbox>
      </ThemeProvider>,
    );
    const element = getByText('Suggestions');
    element.click();
    expect(onChange).toHaveBeenCalled();
  });

  it('Should toggle the checkbox', () => {
    const { getByText, container } = render(
      <ThemeProvider>
        <Checkbox>Male</Checkbox>
        <Checkbox defaultChecked>Female</Checkbox>
      </ThemeProvider>,
    );

    const maleCheckboxLabel = getByText('Male');
    maleCheckboxLabel.click();
    const maleForId = maleCheckboxLabel.getAttribute('for');
    const maleCheckbox = container.querySelector(`input#${maleForId}`) as HTMLInputElement;
    expect(maleCheckbox.checked).toBeTruthy();

    const femaleCheckboxLabel = getByText('Female');
    femaleCheckboxLabel.click();
    const femaleForId = femaleCheckboxLabel.getAttribute('for');
    const femaleCheckbox = container.querySelector(`input#${femaleForId}`) as HTMLInputElement;
    expect(femaleCheckbox.checked).toBeFalsy();
  });

  it('Should have proper aria attribute when invalid', () => {
    const { container } = render(
      <ThemeProvider>
        <Checkbox id="invalid-checkbox" invalid>
          Invalid
        </Checkbox>
      </ThemeProvider>,
    );
    const element = container.querySelector('input#invalid-checkbox');
    expect(element).not.toBeNull();
    expect(element?.getAttribute('aria-invalid')).toBe('true');
  });
});
