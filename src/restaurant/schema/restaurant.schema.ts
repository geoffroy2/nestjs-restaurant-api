import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../auth/schemas/user.schema';
import { Meal } from '../../meal/schemas/meal.schemas';


@Schema()
export class Location {
  @Prop({type:String, enum:['Point']})
  type: string

  @Prop({index:'2dsphere'})
  coordinates: Number[]

  formattedAddress:string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

export enum Category {
  FAST_FOOD = 'Fast Food',
  CAFE = 'Cafe',
  FINE_DINNING = 'Fine Dinning',
}

@Schema({ 
  timestamps: true
})
export class Restaurant {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  email: string;

  @Prop()
  phoneNo: string;

  @Prop()
  address: string;

  @Prop()
  category: Category;

  @Prop()
  images?: object[]

  
  @Prop({type: Object, ref:'Location'})
  location?: Location

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Meal'})
  menu: Meal[]

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  user: User
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
