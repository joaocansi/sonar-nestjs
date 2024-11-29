import { IsEmail, IsString, Matches, ValidateNested } from 'class-validator';

class Passport {
  @IsString()
  @Matches(/\d{11}/)
  number: string;
  @IsString()
  @Matches(/[A-Z]{2}/)
  country: string;
}

export class CreateUserDto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @ValidateNested()
  passport: Passport;
}
