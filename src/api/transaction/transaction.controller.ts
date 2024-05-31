import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { Request } from 'express';

import { TransactionService } from './transaction.service';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

import { AccessTokenGuard } from 'src/common/guards/access-token.guard';

@UseGuards(AccessTokenGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: Request,
  ) {
    return this.transactionService.create(
      createTransactionDto,
      req.user['sub'],
    );
  }

  @Get('')
  findAll(
    @Req() req: Request,
    @Query('limit') limit: string,
    @Query('page') page: string,
  ) {
    return this.transactionService.findAllByUser(req.user['sub'], {
      limit: +limit || 10,
      page: +page || 0,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.transactionService.findOne(+id, req.user['sub']);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
