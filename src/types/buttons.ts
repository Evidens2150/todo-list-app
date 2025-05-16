export type ButtonType = 'button' | 'submit' | 'reset';

export type ButtonColor = 'primary' | 'secondary' | 'danger' | 'success' | 'custom';

export interface IButtonProps {
  type?: ButtonType;
  color?: ButtonColor;
  disabled?: boolean;
  title?: string;
}