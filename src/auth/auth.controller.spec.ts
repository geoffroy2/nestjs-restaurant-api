import { PassportModule } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

const jwtToken = {}
const mockAuthService = {
    signUp: jest.fn().mockResolvedValueOnce(jwtToken),
    login: jest.fn().mockResolvedValueOnce(jwtToken)
}


describe('AuthController', ()=>{
    let controller: AuthController;
    let service: AuthService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports:[  PassportModule.register({defaultStrategy:'jwt'}),],
          controllers: [AuthController],
          providers: [{
              provide: AuthService,
              useValue: mockAuthService
          }],
        }).compile();
    
        controller = module.get<AuthController>(AuthController);
        service = module.get<AuthService>(AuthService)
      });

      it('Should be defined',() =>{
          expect(controller).toBeDefined()
      })


      describe('signUp',  ()=>{
          
      const signUpDto = {
        name:'azerty',
        email:"fleury1@gmail.com",
        password:'12345678'
      }
          it('Should register new User', async () =>{
            const result = await controller.signUp(signUpDto)
            expect(service.signUp).toHaveBeenCalled()
            expect(result).toEqual(jwtToken)
          })
      })

      describe('login', () =>{
          it('should login the user',async() =>{
              const loginDto = {
                  email:'geoffroy@gmail.com',
                  password: '12345678'
              }

              const result = await controller.login(loginDto)

              expect(service.login).toHaveBeenCalled()
              
              expect(result).toEqual(jwtToken)
          })
      })
})