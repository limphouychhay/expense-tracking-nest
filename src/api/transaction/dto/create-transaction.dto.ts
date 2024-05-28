import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { TransactionTypeEnum } from 'src/common/enum/transaction-type.enum';

export class CreateTransactionDto {
  @IsEnum(TransactionTypeEnum)
  @IsNotEmpty()
  type: TransactionTypeEnum;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  category: string;
}
