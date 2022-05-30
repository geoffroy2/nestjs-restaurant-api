import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';
import mongoose from 'mongoose';
import { ignoreElements } from 'rxjs';
import { User } from '../auth/schemas/user.schema';
import APIFeatures from '../utils/apiFeature.utils';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './schema/restaurant.schema';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name) 
    private restaurantModel: mongoose.Model<Restaurant>
  ) {

  }

  async create(createRestaurantDto: CreateRestaurantDto, user: User): Promise<Restaurant> {
    const location = await APIFeatures.getRestaurationLocation(
      createRestaurantDto.address
    )

    const data = Object.assign(createRestaurantDto,{user: user._id,location})
    
    const res = await this.restaurantModel.create(data)
    return res
  }

 async findAll(query: Query): Promise <Restaurant [] > {

   const resPerPage = 2;
   const currentPage = Number(query.page) || 1 ;
   const skip= resPerPage * (currentPage -1);
   const keyword = query.keyword ? {
     name:{
       $regex: query.keyword,
       $options: 'i'
     }
   }:{}

   const restaurants = await this.restaurantModel.find({...keyword}).limit(resPerPage).skip(skip)
    return restaurants;
  }

  async findById(id: string) : Promise<Restaurant> {
    const isValidId = mongoose.isValidObjectId(id)

    if(! isValidId){
      throw new BadRequestException('Wrong monngose ID Error, Please enter correct ID')
    }
    
      const restaurant = await this.restaurantModel.findById(id)
      if(!restaurant){
        throw new NotFoundException('Restaurant not found')
      }
      return restaurant


  }

  findOne(id: number) {
    return `This action returns a #${id} restaurant`;
  }

 async update(id: string, updateRestaurantDto: UpdateRestaurantDto): Promise<Restaurant> {

    await this.findById(id)
    return await this.restaurantModel.findByIdAndUpdate(id, updateRestaurantDto,{
      new: true,
      runValidators: true
    })
  }

  async remove(id: string): Promise<Restaurant> {
    return await this.restaurantModel.findByIdAndDelete(id)
  }

  async uploadImages(id, files) {
    const images = await APIFeatures.upload(files)

    const restaurant = await this.restaurantModel.findByIdAndUpdate(id,{
      images: images as Object[]
    },{
      new: true,
      runValidators:true
    })
   

    return restaurant
  }

  async deleteImages(images) {
     if(images.length ===0) return true;
    const res = await APIFeatures.deleteImages(images)
    return res
  }
}
