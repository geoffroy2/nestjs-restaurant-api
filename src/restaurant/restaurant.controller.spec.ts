import { ForbiddenException } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { Service } from 'aws-sdk';
import APIFeatures from 'src/utils/apiFeature.utils';
import { UserRoles } from '../auth/schemas/user.schema';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './schema/restaurant.schema';



const mockRestaurant = {
    _id:"628bcfea0518ee3c83a76fa1",
      name: "lekio",
      description: "tout vas bien",
      email: "cc@mil.com",
      phoneNo: "44646695",
      address: "Abidjan Cocody angré ",
      category: "Fast Food",
      images: [],
      location: {
          "type": "Point",
          "coordinates": [
              -4.00439,
              5.33223
          ],
          "formattedAddress": "Boulevard André Latrille, Abidjan, Abidjan, CI",
          "city": "Abidjan",
          "state": "Abidjan",
          "zipcode": "",
          "country": "CI"
      },
      user: "628abc94913a3ff1023b6f06",
      createdAt: "2022-05-23T18:13:19.435Z",
      updatedAt: "2022-05-23T18:13:19.435Z",
      
  }
  
  const mockUser= {
    _id: "628abc94913a3ff1023b6f06",
    name:'azerty',
    email:"fleury1@gmail.com",
    role: UserRoles.USER
   
  }

  const mockRestaurantService = {
    findAll: jest.fn().mockResolvedValueOnce([mockRestaurant]),
    create: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn().mockResolvedValueOnce(mockRestaurant),
    update: jest.fn(),
    remove: jest.fn().mockResolvedValueOnce({deleted:true}),
    deleteImages: jest.fn().mockResolvedValueOnce(true),
    uploadImages: jest.fn()
  }
  
describe('UserController', () => {
  let controller: RestaurantController;
  let service: RestaurantService


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports:[  PassportModule.register({defaultStrategy:'jwt'}),],
      controllers: [RestaurantController],
      providers: [{
          provide: RestaurantService,
          useValue: mockRestaurantService
      }],
    }).compile();

    controller = module.get<RestaurantController>(RestaurantController);
    service = module.get<RestaurantService>(RestaurantService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllRestaurants',()=>{
      it('Should get all Restaurants', async() =>{
          
        const result = await controller.findAll({keyword: 'restaurant'})
        expect(service.findAll).toHaveBeenCalled()
        expect(result).toEqual([mockRestaurant])
      })
  })

  describe('create', () =>{
    it('Should create a new restaurant', async() =>{

      const newRestaurant = {
        name: "lekio",
        description: "tout vas bien",
        email: "cc@mil.com",
        phoneNo: "44646695",
        address: "Abidjan Cocody angré ",
        category: "Fast Food",
        user: "628abc94913a3ff1023b6f06",
      }

       mockRestaurantService.create = jest.fn().mockResolvedValueOnce(mockRestaurant)
     
      const result = await controller.create(newRestaurant as any, mockUser as any)

      expect(service.create).toHaveBeenCalled()
      expect(result).toEqual(mockRestaurant)
  
    })
  })

  describe('getRestaurantById', ()=>{
    it('should get restaurant by Id', async() =>{
      const result = await controller.findOne(mockRestaurant._id)

      expect(service.findById).toHaveBeenCalled()
      expect(result).toEqual(mockRestaurant)
    })
  })

  describe('updateRestaurant', ()=>{
    const restaurant =  {...mockRestaurant, name: 'Updated name'}
    const updateRestaurant = {name: 'Updated name'}
    it('Should update restaurant by Id', async()=>{

      mockRestaurantService.findById = jest.fn().mockResolvedValueOnce(mockRestaurant)

      mockRestaurantService.update = jest.fn().mockResolvedValueOnce(restaurant)

      const result = await controller.update(restaurant._id, updateRestaurant as any ,  mockUser as any)

      expect(service.update).toHaveBeenCalled();
      expect(result).toEqual(restaurant)
      expect(result.name).toEqual(restaurant.name)

    })

    it('Should throw forbidden error', async() =>{
      mockRestaurantService.findById = jest.fn().mockResolvedValueOnce(mockRestaurant)
      const user = {
        ...mockUser,
        _id:"xxxxxxxxxxxxxxxxxxxxx"
      }
      await expect( (controller.update(restaurant._id, updateRestaurant as any ,  user as any))).rejects.toThrow(ForbiddenException)
    })
  })

  describe('deleteRestaurant', ()=>{

    it('Should delete restaurant by ID', async()=>{

      mockRestaurantService.findById = jest.fn().mockResolvedValueOnce(mockRestaurant)

      const result = await controller.remove(mockRestaurant._id, mockUser as any)

      expect(service.remove).toHaveBeenCalled()
      expect(result).toEqual({deleted: true})


    })

    
    it('Should not delete restaurant by ID because images are not deleted', async()=>{

      mockRestaurantService.findById = jest.fn().mockResolvedValueOnce(mockRestaurant)
      mockRestaurantService.deleteImages = jest.fn().mockResolvedValueOnce(false)


      const result = await controller.remove(mockRestaurant._id, mockUser as any)

      expect(service.remove).toHaveBeenCalled()
      expect(result).toEqual({deleted: false})
    })

    
    it('Should throw forbidden error', async() =>{
      mockRestaurantService.findById = jest.fn().mockResolvedValueOnce(mockRestaurant)
     // on insert dans l'objet un identifiant different
      const user = {
        ...mockUser,
        _id:"asssssssssssssssssss"
      }

      await expect( (controller.remove(mockRestaurant._id,  user as any))).rejects.toThrow(ForbiddenException)
    })
  })

  describe('uploadFiles',()=>{
    it('Should upload image restaurant', async()=>{
      const mockImages = [{
        "ETag": "\"ef5914c298b7d6ce7c97e97d8f3c362f\"",
        "Location": "https://nestjs-restorant-api.s3.amazonaws.com/restaurants/t%C3%A9l%C3%A9charg%C3%A9_1653529993267.jpg",
        "key": "restaurants/téléchargé_1653529993267.jpg",
        "Key": "restaurants/téléchargé_1653529993267.jpg",
        "Bucket": "nestjs-restorant-api"
      }]
      const updatedRestaurant = {...mockRestaurant, images: mockImages}

      const files = [
        {
          fieldname: 'files',
          originalname: 'amour.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          buffer: "<Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff fe 00 3b 43 52 45 41 54 4f 52 3a 20 67 64 2d 6a 70 65 67 20 76 31 2e 30 20 28 75 73 69 ... 11112 more bytes>",
          size: 11162
        },
      ]

      mockRestaurantService.uploadImages = jest.fn().mockResolvedValueOnce(updatedRestaurant)

      const result = await controller.uploadFile(mockRestaurant._id, files as any)

      expect(service.uploadImages).toHaveBeenCalled()
      expect(result).toEqual(updatedRestaurant)
    })
  })
});
