import { IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @IsPositive()
  @Type(() => Number)
  page: number = 1;
}
