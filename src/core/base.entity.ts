import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  @Exclude()
  createdOn: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Exclude()
  updatedOn: Date;
}
