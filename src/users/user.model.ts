export interface User {
  id: string;
  avatar: string;
  firstname: string;
  lastname: string;
  email: string;
  gender: GenderENUM;
  password: string;
  dob: string;
  createdAt: string;
  updatedAt: string;
}

export enum GenderENUM {
  Male = 'Male',
  Female = 'Female',
  Unspecified = 'Unspecified',
}

export interface Account {
  id: string;
  name: string;
  starterAmount: string;
  theme: string;
  type: AccountTypeENUM;
  createdAt: string;
  updatedAt: string;
}

export enum AccountTypeENUM {
  Male = 'Male',
  Female = 'Female',
  Unspecified = 'Unspecified',
}
