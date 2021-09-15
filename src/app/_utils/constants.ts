import { ButtonsInterface } from '../components/modal/modal.interface';

export const refreshTokenKey = 'refreshToken';
export const tokenKey = 'token';

export const baseModalButton: ButtonsInterface[] = [
  {
    label: 'Сохранить',
    value: 'saved',
    voidType: false,
  },
];

export const firstLetterLowerCase = (string: string) => {
  return string.charAt(0).toLowerCase() + string.slice(1);
};
