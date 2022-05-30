import { IsEmpty, IsEnum, IsNotEmpty, IsString } from "class-validator"
import { User } from "../../auth/schemas/user.schema"
import { Category } from "../schemas/meal.schemas"

export class CreateMealDto {
    @IsNotEmpty()
    @IsString()
    readonly name:string
    @IsNotEmpty()
    @IsString()
    readonly description: string
    @IsNotEmpty()
    @IsString()
    readonly price: number
    @IsNotEmpty()
    @IsEnum(Category,{message:"Please enter correct category for this meal."})
    readonly category: Category
    @IsNotEmpty()
    @IsString()
    readonly restaurant: string

    @IsEmpty({message:'You cannot provide user ID.'})
    readonly user: User
}
