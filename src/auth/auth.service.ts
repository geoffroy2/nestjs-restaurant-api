import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SignupDto } from './dto/signup.dto';
import { User } from './schemas/user.schema';

import * as bcrypt from 'bcryptjs'
import { LoginDto } from './dto/login.dto';
import APIFeatures from '../utils/apiFeature.utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) 
        private userModel: mongoose.Model<User>,
        private jwtService: JwtService
      ) {
    
      }

      async signUp(signUpDto: SignupDto): Promise<{token: string}> {
        const {name, email, password} = signUpDto ;

        const hashedPassword = await bcrypt.hash(password,10)

        try {
            const user = await this.userModel.create({
                name,
                email,
                password:hashedPassword
            })

            const token = await APIFeatures.assignJwtToken(user._id, this.jwtService)
            return {token}
        } catch (error) {
            if(error.code ===11000) {
                throw new ConflictException('Duplicate Email Entered')
            }
        }
      
      }

    async login(loginDto: LoginDto): Promise<{token: string}> {
        const {email, password} = loginDto

        const user = await this.userModel.findOne({email}).select('+password')
        if(!user){
            throw new UnauthorizedException('Invalid Email adredd or password')
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password)
        
        if(!isPasswordMatched){
            throw new UnauthorizedException('Invalid Email adredd or password')
        }

        const token = await APIFeatures.assignJwtToken(user._id, this.jwtService)

        return {token}
    }
}
