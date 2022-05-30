import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { Restaurant } from '../restaurant/schema/restaurant.schema';
import { Meal } from './schemas/meal.schemas';

@Injectable()
export class MealService {
  constructor(
    @InjectModel(Restaurant.name) 
    private restaurantModel: mongoose.Model<Restaurant>,
    @InjectModel(Meal.name) 
    private mealModel: mongoose.Model<Meal>,
  ) {

  }
 async create(meal: Meal, user: User) : Promise<Meal> {
   const data = Object.assign(meal,{user: user._id})

   
   const restaurant =  await this.restaurantModel.findById(meal.restaurant);
    
   console.log(restaurant)

   if(!restaurant){
      throw new NotFoundException('Restaurant not found with this ID.')
   }

   if(restaurant.user.toString() !== user._id.toString()){
      throw new ForbiddenException('You can not add meal to the restaurant')
   }

   const mealCreated = await this.mealModel.create(data);


   restaurant.menu.push(mealCreated)
    await restaurant.save()
    return mealCreated
  }

  async findAll(): Promise<Meal[]> {
    const meals = await this.mealModel.find()
    return meals;
  }

  async findByRestaurant(restaurantId: string): Promise<Meal[]> {
    const meals = await this.mealModel.find({restaurant: restaurantId})
    return meals
  }

  async findOne(id: string) : Promise<Meal>{
    const isValid =mongoose.isValidObjectId(id)
    if(!isValid){
      throw new BadRequestException('Wrong mongoose ID error.')
    }
    const mean = await this.mealModel.findById(id)
    if(!mean){
      throw new NotFoundException('Meal not found with this ID.')
    }
    return mean
  }


  async update(id: string, meal: Meal) : Promise<Meal> {
    return await this.mealModel.findByIdAndUpdate(id, meal,{
      new:true,
      runValidators: true
    })
  }

 async remove(id: string): Promise<{deleted: boolean}> {
    const res = await this.mealModel.findByIdAndDelete(id)
    if(res){
     return {
       deleted: true
     }
    }else {
      return {
        deleted: false
      }
    }
   
  }
}
