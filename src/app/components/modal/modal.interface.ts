export interface ModalOptions {
  heading: string;
  modalWidth?: number;
  readonly buttons?: readonly ButtonsInterface[];
  readonly data?: any;
}

export interface ButtonsInterface {
  appearance?: string;
  label: string;
  value?: any;
  voidType?: boolean;
}
