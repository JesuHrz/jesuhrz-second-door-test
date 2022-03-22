export interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  value?: string;
  onClick?: () => void;
  disabled?: boolean;
  secondary?: boolean;
}