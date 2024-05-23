import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @CreateDateColumn({ type: 'timestamp' })
  createdOn: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedOn: Date;
}
