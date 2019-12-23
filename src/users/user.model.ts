export interface User {
  id: string;
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
