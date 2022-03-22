export interface InputProps {
  placeholder?: string;
  type?: 'text' | 'password' | 'textarea';
  value?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  secondary?: boolean;
}