import { Button, NonIdealState } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import classNames from 'classnames';
import React from 'react';

export interface NonIdealStateWithNavigationButtonsProps {
  icon: string | undefined;
  title: string | undefined;
  description: string | undefined;
  buttonCallback: (reverse?: boolean | undefined) => void;
  buttonDisabled: boolean | undefined;
}

export function NonIdealStateWithNavigationButtons(
  props: Readonly<NonIdealStateWithNavigationButtonsProps>
) {
  const { icon, title, description, buttonCallback, buttonDisabled } = props;
  const nextSDCallback = React.useCallback(() => buttonCallback(false), [buttonCallback]);
  const prevSDCallback = React.useCallback(() => buttonCallback(true), [buttonCallback]);
  return (
    <div className="non-ideal-state-with-navigation-buttons-container">
      <div className="measurement-mode-window-label">
        <div className={classNames({ 'label-channel-name-row': true, 'non-ideal-state': true })}>
          <span className="station-name">&nbsp;</span>
          <span className="station-name__channel-name">&nbsp;</span>
          <span className="station-name__label-icon" />
        </div>
        <div className={classNames({ 'label-measurement-row': true, 'non-ideal-state': true })}>
          <span className="amplitude-type">&nbsp;</span>
          <span className="period-label">&nbsp;</span>
        </div>
        <div
          className={classNames({ 'measure-mode-label__buttons': true, 'non-ideal-state': true })}
        >
          <Button
            className={classNames({
              'previous-button': true,
              'measure-mode-buttons-disabled': buttonDisabled
            })}
            text="Prev"
            onClick={prevSDCallback}
            title={
              buttonDisabled ? 'No required phases to review' : 'Review the previous required phase'
            }
            disabled={buttonDisabled}
          />
          <Button
            className={classNames({
              'next-button': true,
              'measure-mode-buttons-disabled': buttonDisabled
            })}
            text="Next"
            onClick={nextSDCallback}
            title={
              buttonDisabled ? 'No required phases to review' : 'Review the next required phase'
            }
            disabled={buttonDisabled}
          />
        </div>
      </div>
      <NonIdealState
        icon={icon ? IconNames[icon] : undefined}
        title={title}
        description={description}
      />
    </div>
  );
}
