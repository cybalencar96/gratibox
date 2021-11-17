import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import makeDbFactory from '../src/database/database.js';
import { getInvalidUser, getValidUser, getValidDeliverInfos } from '../src/utils/faker.js';

const db = makeDbFactory();
const invalidUser = getInvalidUser();
const validUser = getValidUser();
const validUser2 = getValidUser();
const validDeliverInfos = getValidDeliverInfos();

afterAll(async () => {
    await db.clear([
        'deliver_infos',
        'subscribers',
        'sessions',
        'users',
    ]);

    db.endConnection();
});

describe('SUBSCRIBERS ENTITY', () => {
    let userSubscribed;
    let tokenSubscribed;
    let user2;
    let token2;

    beforeEach(async () => {
        await db.clear([
            'deliver_infos',
            'subscribers',
            'sessions',
            'users',
        ]);

        userSubscribed = await db.users.add(validUser);
        tokenSubscribed = await db.users.createSession(userSubscribed.id);

        const result = await db.subscribers.add({
            userId: userSubscribed.id,
            subscriptionType: 'weekly',
            deliverOption: 'monday',
            teas: true,
            incenses: true,
            organics: true,
        });

        user2 = await db.users.add(validUser2);
        token2 = await db.users.createSession(user2.id);
    });

    describe('route POST /subscriber', () => {
        test('should return 401 when invalid or not token', async () => {
            const result = await supertest(app)
                .post('/subscriber')
                .send({
                    subscriptionType: 'monthly',
                    deliverOption: '10',
                    teas: true,
                    incenses: true,
                    organics: true,
                    deliverInfos: validDeliverInfos
                });

            expect(result.status).toEqual(401);
        });

        test('should return 400 when invalid body', async () => {
            const result = await supertest(app)
                .post('/subscriber')
                .set('Authorization', `Bearer ${token2}`)

            expect(result.status).toEqual(400);
        });

        test('should return 200 when user subscribed', async () => {
            const result = await supertest(app)
                .post('/subscriber')
                .set('Authorization', `Bearer ${token2}`)
                .send({
                    subscriptionType: 'monthly',
                    deliverOption: '10',
                    teas: true,
                    incenses: true,
                    organics: true,
                    deliverInfos: validDeliverInfos
                });

            expect(result.status).toEqual(200);
        });
    });
});