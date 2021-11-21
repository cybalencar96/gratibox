import faker from "faker";
import fakerbr from "faker/locale/pt_BR";
import { generatePassword } from "./sharedFunction.js";
import { randomIntFromInterval } from "./sharedFunction.js";

function getValidUser() {
  return {
    name: faker.name.findName(),
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
    cep: fakerbr.address.zipCode().replace("-", ""),
    city: fakerbr.address.cityName(),
    address: fakerbr.address.streetAddress(),
    uf: fakerbr.address.stateAbbr(),
  };
}

function getValidAvaliation(deliveryId) {
  const randomBool = !!randomIntFromInterval(0, 1);
  const fakeType = faker.lorem.words(3);
  const fakeDesc = faker.lorem.words(3);

  if (randomBool) {
    return {
      deliveryId: deliveryId,
      avaliation: randomBool,
    };
  }

  return {
    deliveryId: deliveryId,
    avaliation: randomBool,
    avaliationType: fakeType,
    avaliationDesc: fakeDesc,
  };
}

export {
  getValidUser,
  getInvalidUser,
  getValidDeliverInfos,
  getValidAvaliation,
};
