import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, ForbiddenException } from '@nestjs/common';
import { MealService } from './meal.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-users.decorators';
import { User } from '../auth/schemas/user.schema';
import { Meal } from './schemas/meal.schemas';

@Controller('meal')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Post()
  @UseGuards(AuthGuard())
  create(@Body() createMealDto: CreateMealDto, @CurrentUser() user: User) : Promise<Meal>{
    
    return this.mealService.create(createMealDto,user);
  }

  @Get()
  async getAllMeals(): Promise<Meal[]>  {
    return this.mealService.findAll();
  }

  @Get('restaurant/:id')
  async getAllMealsByRestaurant(@Param('id') id: string): Promise<Meal[]>  {
    return this.mealService.findByRestaurant(id);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mealService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
 async  update(@Param('id') id: string, @Body() updateMealDto: UpdateMealDto,@CurrentUser() user: User) {
    const mean = await this.mealService.findOne(id)
    if(mean.user._id.toString() !== user._id.toString()) {
      throw new ForbiddenException('You Can not updated this mean')
    }
    return this.mealService.update(id, updateMealDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
 async remove(@Param('id') id: string,@CurrentUser() user: User) : Promise<{deleted: boolean}>{
  const mean = await this.mealService.findOne(id)
  if(mean.user._id.toString() !== user._id.toString()) {
    throw new ForbiddenException('You Can not deleted this mean')
  }
    return this.mealService.remove(id);
  }
}
