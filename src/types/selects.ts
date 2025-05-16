export type SelectValue = string | number | boolean | null;

export interface ISelectOption {
  label: string;
  value: SelectValue;
}

export interface ISelectProps {
  list?: ISelectOption[];
}