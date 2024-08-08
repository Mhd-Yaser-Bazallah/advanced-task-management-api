 
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne
  } from 'typeorm';
import { IsNotEmpty } from 'class-validator';   
import{Taskstatus} from './task-status.enum'
import{User} from './../../user/entities/user.entity'
 
@Entity()
export class Task {

    @PrimaryGeneratedColumn()
    id: number;
    @IsNotEmpty({ message: 'title should not be empty' })
    @Column()
    title:string;

    @Column()
    description:string;

    @Column({
        type: 'enum',
        enum: Taskstatus,
        default: Taskstatus.PENDING,
      })
      status: Taskstatus;

      @ManyToOne(() => User, (user) => user.tasks, { eager: false })
      user: User;
}
