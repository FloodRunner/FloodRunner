import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

const _validPayload = {
  iss: 'https://javaadpatel.eu.auth0.com/',
  sub: 'google-oauth2|11215125678416842', //user signed in with google,
  aud: ['floodrunnerapi', 'https://javaadpatel.eu.auth0.com/userinfo'],
  iat: 1592682648,
  exp: 1592769048,
  azp: 'VyTuu0Be9TV74vwtpUV6o58xkUOl0Rct',
  scope: 'openid profile email',
};

const _invalidPayload = {
  iss: 'https://javaadpatel.eu.auth0.com/',
  sub: 'google-oauth2|11215125678416842', //user signed in with google,
  aud: ['floodrunnerapi', 'https://javaadpatel.eu.auth0.com/userinfo'],
  iat: 1592682648,
  exp: 1592769048,
  azp: 'VyTuu0Be9TV74vwtpUV6o58xkUOl0Rct',
  scope: 'openid',
};

const mockUserRepository = () => ({
  findById: jest.fn(),
  createUser: jest.fn(),
});

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();

    jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('validate', () => {
    it('validates and returns the user based on JWT payload', async () => {
      //arrange
      const user = { sub: 'test', _id: 'test' };
      userRepository.findById.mockResolvedValue(user);

      //act
      const result = await jwtStrategy.validate(_validPayload);

      //assert
      expect(result).toEqual(user);
      expect(userRepository.findById).toHaveBeenCalledWith(_validPayload.sub);
      expect(userRepository.createUser).toHaveBeenCalledTimes(0);
    });

    it('validates and creates the user based on JWT payload', async () => {
      //arrange
      const user = { sub: 'test', _id: 'test' };
      userRepository.findById.mockResolvedValue(null);
      userRepository.createUser.mockResolvedValue(user);

      //act
      const result = await jwtStrategy.validate(_validPayload);

      //assert
      expect(result).toEqual(user);
      expect(userRepository.findById).toHaveBeenCalledWith(_validPayload.sub);
      expect(userRepository.createUser).toHaveBeenCalledWith(_validPayload);
    });

    it('throws an exception when invalid scopes', async () => {
      //act
      expect(jwtStrategy.validate(_invalidPayload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
