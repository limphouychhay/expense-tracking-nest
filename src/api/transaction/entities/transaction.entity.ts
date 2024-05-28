import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/core/base.entity';
import { User } from 'src/api/user/entities/user.entity';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  type: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  title: string;

  @Column({ type: 'double', nullable: false, default: 0 })
  amount: number;

  @Column({ type: 'varchar', nullable: false })
  category: string;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;
}
