import { UnauthorizedException } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";
import { User, UserRoles } from "../schemas/user.schema";
import { JwtStrategy } from "./jwt.strategy";


const mockUser= {
    _id: "628abc94913a3ff1023b6f06",
    name:'azerty',
    email:"fleury1@gmail.com",
    role: UserRoles.USER,
    password:'hashedPassword'
   
  }
describe('JwtStrategy', ()=>{
    let jwtStrategy: JwtStrategy;
    let model: Model<User>
  
    beforeEach(async () => {

        process.env.JWT_SECRET = "spiritual93"

      const module: TestingModule = await Test.createTestingModule({
        providers: [JwtStrategy , {
          provide: getModelToken(User.name),
          useValue: {
              findById: jest.fn()
          }
        }],
      }).compile();
  
      jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
      model = module.get<Model<User>>(getModelToken(User.name))
    });

    afterEach(() =>{
        delete  process.env.JWT_SECRET
    })

    it('Should be defined', ()=>{
        expect(jwtStrategy).toBeDefined()
    })

    describe('validate', ()=>{
        it('Should validates and return the user',  async() =>{
            jest.spyOn(model,'findById').mockResolvedValueOnce(mockUser as any)

            const result = await jwtStrategy.validate({id: mockUser._id})

            expect(model.findById).toHaveBeenCalledWith(mockUser._id)
            expect(result).toEqual(mockUser)
        })
    })

    it('Should throw Unauthorized Exception', async ()=>{
        jest.spyOn(model,'findById').mockResolvedValueOnce(null)

        expect(jwtStrategy.validate({id: mockUser._id})).rejects.toThrow(UnauthorizedException)
    })
})