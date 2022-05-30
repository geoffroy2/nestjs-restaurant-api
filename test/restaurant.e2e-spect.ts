import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import * as mongoose from 'mongoose';

describe('RestaurantController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(() => mongoose.disconnect());

  const user = {
    name: 'geoffroy',
    email: 'geoffroy@gmail.com',
    password: '12345678',
  };

  const newRestaurant = {
    name: 'lekio',
    description: 'tout vas bien',
    email: 'cc@mil.com',
    phoneNo: '44646695',
    address: 'Abidjan Cocody angré ',
    category: 'Fast Food',
    user: '628abc94913a3ff1023b6f06',
  };

  let jwtToken;
  let restaurantCreated;

  it('(Get) - login  user', () => {
    return request(app.getHttpServer())
      .get('/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(200)
      .then((res) => {
        expect(res.body.token).toBeDefined();
        jwtToken = res.body.token;
      });
  });

  it('(POST)- creates a new restaurant ', () => {
    return request(app.getHttpServer())
      .post('/restaurant')
      .set('Authorization', 'Bearer' + jwtToken)
      .send(newRestaurant)
      .expect(201)
      .then((res) => {
        expect(res.body.token).toBeDefined();
        expect(res.body.name).toEqual(newRestaurant.name);
        restaurantCreated = res.body;
      });
  });

  it('(GET)- get all restaurants ', () => {
    return request(app.getHttpServer())
      .get('/restaurant')
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBe(1);
      });
  });

  it('GET - restaurant by Id', () => {
    return request(app.getHttpServer())
      .get(`/restaurant/${restaurantCreated._id}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body._id).toEqual(restaurantCreated._id);
      });
  });

  it('PUT - updated restaurant by Id', () => {
    return request(app.getHttpServer())
      .put(`/restaurant/${restaurantCreated._id}`)
      .set('Authorization', 'Bearer' + jwtToken)
      .send({ name: 'Updated name' })
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.name).toEqual('Updated name');
      });
  });

  it('Delete - delete restaurant by Id', () => {
    return request(app.getHttpServer())
      .delete(`/restaurant/${restaurantCreated._id}`)
      .set('Authorization', 'Bearer' + jwtToken)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.deleted).toEqual(true);
      });
  });
});
