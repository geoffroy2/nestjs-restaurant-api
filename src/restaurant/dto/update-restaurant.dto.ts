import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Category } from '../schema/restaurant.schema';


export class UpdateRestaurantDto  {

    @IsString() 
    @IsOptional()
    readonly name: string;
 
  
    @IsString() 
    @IsOptional()
    readonly description: string;
 

    @IsEmail({},{message: "Entrer un  mail correcte svp"}) 
    @IsOptional()
    readonly email: string;
 
 
    @IsPhoneNumber('CI') 
    @IsOptional()
    readonly phoneNo: string;
 

    @IsString() 
    @IsOptional()
    readonly address: string;
 
    
    @IsEnum(Category,{message: "stp entrer une categorie correcte"}) 
    @IsOptional()
    readonly category: Category;
}
