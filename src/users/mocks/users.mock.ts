import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

export function createRandomUser() {
  return {
    id: uuidv4(),
    email: faker.internet.email(),
  };
}

export const mockedGetUsers = faker.helpers.multiple(createRandomUser, {
  count: 5,
});

export const mockedCorrectSignUpCredentials: AuthCredentialsDto = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};

export const mockedCreatedUser = {
  id: uuidv4(),
  email: faker.internet.email(),
};
