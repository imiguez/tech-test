import { SignUpResponse } from 'src/auth/auth.types';

export const mockedSignUpResponse: () => SignUpResponse = () => ({
  session: 'mockedSessionJwt',
  expiresIn: 60 * 15 * 1000,
});
