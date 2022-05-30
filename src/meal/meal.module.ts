import { Module } from '@nestjs/common';
import { MealService } from './meal.service';
import { MealController } from './meal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MealSchema } from './schemas/meal.schemas';
import { AuthModule } from '../auth/auth.module';
import { RestaurantModule } from '../restaurant/restaurant.module';

@Module({
  imports:[
    AuthModule,
    MongooseModule.forFeature([
      {name:'Meal', schema: MealSchema}
    ]),
    RestaurantModule
  ],
  controllers: [MealController],
  providers: [MealService]
})
export class MealModule {}
