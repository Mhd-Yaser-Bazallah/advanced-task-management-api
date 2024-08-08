 
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    BeforeInsert
  } from 'typeorm';
  import * as bcrypt from 'bcryptjs';
import{UserRole}from './user-role.enum'
import{Task} from './../../task/entities/task.entity'

@Entity()  
export class User {

    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    username: string;
  
    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
      })
      role: UserRole;

      @OneToMany(() => Task, (task) => task.user, { eager: true })
      tasks: Task[];

      @BeforeInsert()
      async hashPassword() {
      this.password = await bcrypt.hash(this.password,12);
  }
    
}
