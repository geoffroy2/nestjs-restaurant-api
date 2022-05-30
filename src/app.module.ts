import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantModule } from './restaurant/restaurant.module';
import { AuthModule } from './auth/auth.module';
import { MealModule } from './meal/meal.module';

@Module({
  imports: [
    RestaurantModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.prod'],

      // envFilePath: `env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    AuthModule,
    MealModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
