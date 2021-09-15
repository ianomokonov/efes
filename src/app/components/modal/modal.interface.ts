export interface ModalOptions {
  readonly heading: string;
  readonly buttons?: readonly ButtonsInterface[];
  readonly data?: any;
}

export interface ButtonsInterface {
  appearance?: string;
  label: string;
  value?: any;
  voidType: boolean;
}
