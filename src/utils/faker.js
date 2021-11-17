import faker from 'faker';
import { generatePassword } from './sharedFunction.js';

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getValidUser() {
    return {
        email: faker.internet.email(),
        password: generatePassword(),
    };
}

function getInvalidUser() {
    return {
        email: faker.internet.email(),
        password: generatePassword(1, 1, 1, 1),
    };
}

export {
    getValidUser,
    getInvalidUser,
};
