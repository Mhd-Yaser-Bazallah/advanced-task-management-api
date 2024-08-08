import { IsEnum, IsString } from 'class-validator';
import{Taskstatus} from './../entities/task-status.enum'


export class CreateTaskDto {
    
    @IsString()
    title:string;

    @IsString()
    description:string;
    
    @IsEnum(Taskstatus)
    status: Taskstatus;
}
