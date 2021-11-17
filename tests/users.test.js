import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import makeDbFactory from '../src/database/database.js';
import { getInvalidUser, getValidUser } from '../src/utils/faker.js';

const db = makeDbFactory();
const invalidUser = getInvalidUser();
const validUser = getValidUser();
const validUser2 = getValidUser();

afterAll(async () => {
    await db.clear([
        'sessions',
        'users'
    ]);

    db.endConnection();
});

describe('USERS ENTITY', () => {

    beforeEach(async () => {
        await db.clear([
            'sessions',
            'users',
        ]);

        await db.users.add(validUser2);

    });

    describe('route POST /sign-up', () => {
        test('should return 400 when user invalid', async () => {
            const result = await supertest(app)
                .post('/sign-up')
                .send(invalidUser)

            expect(result.status).toEqual(400);
        });
        
        test('should return 200 when user registered', async () => {
            const result = await supertest(app)
                .post('/sign-up')
                .send(validUser)
            
            expect(result.status).toEqual(200);
        });
    });

    describe('route POST /sign-in', () => {
        test('should return 401 when invalid credentials', async () => {
            const result = await supertest(app)
                .post('/sign-in')
                .send(invalidUser)

            expect(result.status).toEqual(401);
        });
        
        test('should return 200 when user registered', async () => {
            const result = await supertest(app)
                .post('/sign-in')
                .send(validUser2)
            
            expect(result.status).toEqual(200);
        });
    });
});