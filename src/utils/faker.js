import faker from 'faker';
import fakerbr from 'faker/locale/pt_BR';
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

function getValidDeliverInfos() {
    return {
        name: faker.name.findName(),
        cep: fakerbr.address.zipCode().replace('-',''),
        city: fakerbr.address.cityName(),
        address: fakerbr.address.streetAddress(),
        uf: fakerbr.address.stateAbbr()
    }
}

export {
    getValidUser,
    getInvalidUser,
    getValidDeliverInfos,
};
