
import { IsEmpty, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { Category } from '../schemas/meal.schemas';


export class UpdateMealDto {

    @IsOptional()
    @IsString()
    readonly name:string

    @IsOptional()
    @IsString()
    readonly description: string

    @IsOptional()
    @IsString()
    readonly price: number

    @IsOptional()
    @IsEnum(Category,{message:"Please enter correct category for this meal."})
    readonly category: Category
    
    @IsOptional()
    @IsString()
    readonly restaurant: string

    @IsEmpty({message:'You cannot provide user ID.'})
    readonly user: User
}
