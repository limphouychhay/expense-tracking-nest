import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Transaction } from './entities/transaction.entity';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, userId: number) {
    const { type, title, amount, category } = createTransactionDto;

    try {
      return await this.transactionRepo.save({
        type: type,
        title: title,
        amount: amount,
        category: category,
        user: {
          id: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAllByUser(userId: number) {
    try {
      const transactions = await this.transactionRepo.find({
        where: { user: { id: userId } },
      });
      if (transactions.length <= 0) {
        return [];
      }
      return transactions;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number, userId: number) {
    try {
      const transaction = await this.transactionRepo.findOneBy({
        id,
        user: { id: userId },
      });
      if (!transaction) {
        throw new NotFoundException();
      }
      return transaction;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    try {
      const transaction = await this.transactionRepo.findOneBy({ id });
      if (!transaction) {
        throw new NotFoundException();
      }
      return this.transactionRepo.save({
        ...transaction,
        ...updateTransactionDto,
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.transactionRepo.delete({ id });
    } catch (error) {
      throw error;
    }
  }
}
