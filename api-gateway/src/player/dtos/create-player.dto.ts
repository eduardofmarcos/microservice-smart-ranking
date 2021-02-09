import { IsNotEmpty, IsEmail } from 'class-validator';

//what comes in request and will traffic in all app, there is no behavior
export class CreatePlayerDTO {
  @IsNotEmpty()
  readonly phoneNumber: string;
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly name: string;
  @IsNotEmpty()
  readonly category_id: string;
}
