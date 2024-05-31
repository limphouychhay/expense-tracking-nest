import { Entity, Column, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

import { BaseEntity } from 'src/core/base.entity';
import { Transaction } from 'src/api/transaction/entities/transaction.entity';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Exclude()
  password: string;

  @Column({ type: 'boolean', default: true })
  @Exclude()
  isActive: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  refreshToken: string;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  @Exclude()
  transactions: Transaction[];
}
