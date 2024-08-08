import { IsEnum, IsString } from 'class-validator';
import{Taskstatus} from './../entities/task-status.enum' 
import { IsNotEmpty } from 'class-validator';   

export class UpdateTaskDto {

    @IsNotEmpty({ message: 'title should not be empty' })
    title:string;
    
    @IsString()
    description:string;
    
    @IsEnum(Taskstatus)
    status: Taskstatus;
 
}
