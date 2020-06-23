import React, { FunctionComponent } from 'react';
import styles from './Button.module.css';

interface ButtonContainerProps {
  children?: any,
}

export const ButtonContainer: FunctionComponent<ButtonContainerProps> = (
  { children }
  ): JSX.Element => (
  <div className={styles.container}>
    {children}
  </div>
)


interface ButtonProps {
  name: string,
  color? : string,
  backgroundColor?: string,
  onClick?(): void;
}

export const Button: FunctionComponent<ButtonProps> = (
  { name, color = 'black', backgroundColor = 'white', onClick = function(){}}
  ): JSX.Element => {
  return (
    <button className={styles.wrapper} onClick={() => onClick()}>
      {name}
    </button>
  )
}
