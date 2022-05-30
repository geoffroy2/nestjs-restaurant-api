import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { UserRoles } from '../auth/schemas/user.schema';
import APIFeatures from '../utils/apiFeature.utils';
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
  find: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
}

describe('RestaurantService', () => {
  let service: RestaurantService;
  let model: Model<Restaurant>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestaurantService , {
        provide: getModelToken(Restaurant.name),
        useValue: mockRestaurantService
      }],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
    model = module.get<Model<Restaurant>>(getModelToken(Restaurant.name))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('findAll',() =>{

    it('should get all restaurants',async()=>{

      jest.spyOn(model,'find').mockImplementationOnce(() => ({
        limit: () => ({
          skip: jest.fn().mockResolvedValue([mockRestaurant])
        })
      } as  any))

      const restaurants = await service.findAll({keyword:'restaurant'})
      expect(restaurants).toEqual([mockRestaurant])
    })
  })

  describe('create',()=>{
    const newRestaurant = {
      name: "lekio",
      description: "tout vas bien",
      email: "cc@mil.com",
      phoneNo: "44646695",
      address: "Abidjan Cocody angré ",
      category: "Fast Food",
      user: "628abc94913a3ff1023b6f06",
    }

    it('Should create a new restaurant',async()=>{
      jest.spyOn(APIFeatures,'getRestaurationLocation').mockImplementationOnce(()=> Promise.resolve(mockRestaurant.location))

     jest.spyOn(model,'create').mockImplementationOnce(() => Promise.resolve(mockRestaurant))

      const result = await service.create(newRestaurant as any, mockUser as any)
      expect(result).toEqual(mockRestaurant)
    })

  })

  describe('findById',() =>{
    it('Should get restaurant by Id', async () =>{
      jest.spyOn(model,'findById').mockResolvedValueOnce(mockRestaurant as any)

      const result = await service.findById(mockRestaurant._id)

      expect(result).toEqual(mockRestaurant)
    })

    it('Should throw wrong moongose id error', async()=> {
      await expect(service.findById('wrongId')).rejects.toThrow(BadRequestException)
    })
  
    
    it('Should throw restaurant not found error', async()=> {
  
      const mockError = new NotFoundException('Restaurant not found')
      jest.spyOn(model,'findById').mockRejectedValueOnce(mockError)
  
      await expect(service.findById(mockRestaurant._id)).rejects.toThrow(NotFoundException)
    })
  })

  describe('updatedById',() =>{
     it('should update the restaurant', async() =>{
       const restaurant =  {...mockRestaurant, name: 'Updated name'}
       const updateRestaurant = {name: 'Updated name'}

       jest.spyOn(mockRestaurantService,'findById').mockResolvedValueOnce(mockRestaurant)
       jest.spyOn(model,'findByIdAndUpdate').mockResolvedValueOnce(restaurant as any)

       const updatedRestaurant = await service.update(restaurant._id,updateRestaurant as any)
       expect(updatedRestaurant.name).toEqual(updateRestaurant.name)

     })
  })

  describe('deletedById',() =>{
    it('shoudl Delete restaurant', async () =>{
      const deleteMessage = {deleted:true};

      jest.spyOn(model,'findByIdAndDelete').mockResolvedValueOnce(deleteMessage as any)

      const result = await service.remove(mockRestaurant._id)
      expect(result).toEqual(deleteMessage)
    })
  })

  describe('uploadImages', () =>{
    it('should upload restaurant images on S3 Bucket', async() =>{

      const mockImages = [{
        "ETag": "\"ef5914c298b7d6ce7c97e97d8f3c362f\"",
        "Location": "https://nestjs-restorant-api.s3.amazonaws.com/restaurants/t%C3%A9l%C3%A9charg%C3%A9_1653529993267.jpg",
        "key": "restaurants/téléchargé_1653529993267.jpg",
        "Key": "restaurants/téléchargé_1653529993267.jpg",
        "Bucket": "nestjs-restorant-api"
      }]
      const updatedRestaurant = {...mockRestaurant, images: mockImages}

      jest.spyOn(APIFeatures,'upload').mockResolvedValueOnce(mockImages)
      jest.spyOn(model,'findByIdAndUpdate').mockResolvedValueOnce(updatedRestaurant as any)

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
      const result = await service.uploadImages(mockRestaurant._id, files  )

      expect(result).toEqual(updatedRestaurant)
    })
  })

  describe('deleteImages', ()=>{
    it('Should delete images restaurant S3 Bucket', async() =>{
      const mockImages = [{
        "ETag": "\"ef5914c298b7d6ce7c97e97d8f3c362f\"",
        "Location": "https://nestjs-restorant-api.s3.amazonaws.com/restaurants/t%C3%A9l%C3%A9charg%C3%A9_1653529993267.jpg",
        "key": "restaurants/téléchargé_1653529993267.jpg",
        "Key": "restaurants/téléchargé_1653529993267.jpg",
        "Bucket": "nestjs-restorant-api"
      }]

      jest.spyOn(APIFeatures,'deleteImages').mockResolvedValueOnce(true)
      const result = await service.deleteImages(mockImages)

      expect(result).toBe(true)
      
    })
  })

});
