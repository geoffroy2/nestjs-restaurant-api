import { IsEmail, IsEmpty, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { User } from "../../auth/schemas/user.schema";
import { Meal } from "../../meal/schemas/meal.schemas";
import { Category } from "../schema/restaurant.schema";

export class CreateRestaurantDto {
  
   @IsNotEmpty()
   @IsString() 
   readonly name: string;

   @IsNotEmpty()
   @IsString() 
   readonly description: string;

   @IsNotEmpty()
   @IsEmail({},{message: "Entrer un  mail correcte svp"}) 
   readonly email: string;

   @IsNotEmpty()
   @IsString() 
   readonly phoneNo: string;

   @IsNotEmpty()
   @IsString() 
   readonly address: string;

   
   @IsNotEmpty()
   @IsEnum(Category,{message: "stp entrer une categorie correcte"}) 
   readonly category: Category;

   
   @IsEmpty({message:'You cannot provide the user ID.'})
   @IsOptional()
   readonly user: User

   @IsEmpty()
   @IsOptional()
   readonly menu: Meal[]
}
