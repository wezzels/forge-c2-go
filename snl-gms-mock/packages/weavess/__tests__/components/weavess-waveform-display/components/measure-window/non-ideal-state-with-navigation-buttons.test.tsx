import { IconNames } from '@blueprintjs/icons';
import { render } from '@testing-library/react';
import * as React from 'react';

import { NonIdealStateWithNavigationButtons } from '../../../../../src/ts/components/weavess-waveform-display/components/measure-window/non-ideal-state-with-navigation-buttons';

describe('NonIdealStateWithNavigationButtons', () => {
  it('renders correctly', () => {
    const niswnb = render(
      <NonIdealStateWithNavigationButtons
        icon={IconNames.ERROR.toUpperCase()}
        title="Watch out!"
        description="for that tree"
        buttonCallback={jest.fn()}
        buttonDisabled={false}
      />
    );
    expect(niswnb).toMatchSnapshot();
  });
});
