import { mockedSignUpResponse } from 'src/__mocks__/data/auth.mocks';

export const AuthService = jest.fn().mockReturnValue({
  signUp: jest.fn().mockResolvedValue(mockedSignUpResponse()),
  login: jest.fn().mockResolvedValue(mockedSignUpResponse()),
});
