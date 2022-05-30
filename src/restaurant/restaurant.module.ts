import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantSchema } from './schema/restaurant.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports:[
    AuthModule,
    MongooseModule.forFeature([
      {name:'Restaurant', schema: RestaurantSchema}
    ])
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports:[
    MongooseModule
  ]
})
export class RestaurantModule {}
