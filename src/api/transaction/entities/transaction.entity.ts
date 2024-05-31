import { Column, Entity, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';

import { BaseEntity } from 'src/core/base.entity';
import { User } from 'src/api/user/entities/user.entity';

@Entity({ name: 'transaction' })
export class Transaction extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  type: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  title: string;

  @Column({ type: 'double', nullable: false, default: 0 })
  amount: number;

  @Column({ type: 'varchar', nullable: false })
  category: string;

  @ManyToOne(() => User, (user) => user.transactions)
  @Exclude()
  user: User;
}
