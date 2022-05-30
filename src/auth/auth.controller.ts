import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';



@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){
    }

    @Post('/signup')
    signUp(@Body() sigUpDto:SignupDto): Promise<{token: string}>{
        return this.authService.signUp(sigUpDto)
    }

    @Post('/login')
    login(@Body() loginDto:LoginDto): Promise<{token: string}>{
        return this.authService.login(loginDto)
    }
}
