import { Passport } from './passport';

export default interface User {
  name: string;
  email: string;
  password: string;
  passport: Passport;
}
