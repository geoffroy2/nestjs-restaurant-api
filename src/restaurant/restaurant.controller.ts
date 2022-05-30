import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './schema/restaurant.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-users.decorators';
import { User } from '../auth/schemas/user.schema';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from '../auth/decorators/roles.decorators';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin', 'user')
  @UsePipes(ValidationPipe)
  async create(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @CurrentUser() user: User,
  ): Promise<Restaurant> {
    return this.restaurantService.create(createRestaurantDto, user);
  }

  @Get()
  @UseGuards(AuthGuard())
  async findAll(@Query() query: ExpressQuery): Promise<Restaurant[]> {
    return this.restaurantService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @CurrentUser() user: User,
  ) {
    const res = await this.restaurantService.findById(id);

    // a revoir
    // res.user._id.toString() !== user._id.toString()
    if (res.user.toString() !== user._id.toString()) {
      throw new ForbiddenException('You Can not updated this restaurant');
    }

    return this.restaurantService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ deleted: boolean }> {
    const restaurant = await this.restaurantService.findById(id);
    //restaurant.user._id.toString() !== user._id.toString()
    if (restaurant.user.toString() !== user._id.toString()) {
      throw new ForbiddenException('You Can not updated this restaurant');
    }

    const isDeleted = await this.restaurantService.deleteImages(
      restaurant.images,
    );

    if (isDeleted) {
      this.restaurantService.remove(id);
      return {
        deleted: true,
      };
    } else {
      return {
        deleted: false,
      };
    }
  }

  @Put('upload/:id')
  @UseGuards(AuthGuard())
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log(files[0]);
    await this.restaurantService.findById(id);
    const res = await this.restaurantService.uploadImages(id, files);
    return res;
  }
}
