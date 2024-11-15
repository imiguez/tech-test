import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import * as admin from 'firebase-admin';
import { FirebaseService } from 'src/firebase/firebase.service';
import { FirebaseError } from 'firebase/app';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private fb: FirebaseService,
  ) {
    const password = '123456';
    const authDto = new CreateAuthDto();
    authDto.email = 'test@gmail.com';
    authDto.password = password;
    this.usersRepository.findOneBy({ email: authDto.email }).then((user) => {
      if (!user) {
        this.signUp(authDto)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .then((response) => {
            console.log(
              `User ${authDto.email} with password ${password} created.`,
            );
          });
      } else {
        console.log(
          `User ${authDto.email} with password ${password} already exists.`,
        );
      }
    });
  }

  async signUp(
    user: CreateAuthDto,
  ): Promise<{ session: string; expiresIn: number }> {
    try {
      const noHashedPassword = user.password;
      user.password = await hash(user.password, 10);
      await this.usersRepository.insert(user);

      const expiresIn = 60 * 15 * 1000;
      const userCredentials: any = await createUserWithEmailAndPassword(
        this.fb.getAuth(),
        user.email,
        noHashedPassword,
      );

      const session = await admin
        .app()
        .auth()
        .createSessionCookie(userCredentials._tokenResponse.idToken, {
          expiresIn,
        });

      return { session, expiresIn };
    } catch (error: any) {
      console.log(error);
      if (error instanceof FirebaseError)
        throw new InternalServerErrorException(
          'Error trying to create the user in Firebase.',
        );
      throw new InternalServerErrorException('Error trying to create user.');
    }
  }

  async login(
    user: CreateAuthDto,
  ): Promise<{ session: string; expiresIn: number }> {
    try {
      const userCredentials: any = await signInWithEmailAndPassword(
        this.fb.getAuth(),
        user.email,
        user.password,
      );

      await admin
        .app()
        .auth()
        .verifyIdToken(userCredentials._tokenResponse.idToken, true);

      const expiresIn = 60 * 15 * 1000;
      const session = await admin
        .app()
        .auth()
        .createSessionCookie(userCredentials._tokenResponse.idToken, {
          expiresIn,
        });

      return { session, expiresIn };
    } catch (error) {
      console.log(error);
      if (
        error instanceof FirebaseError &&
        error.code.includes('invalid-credential')
      )
        throw new UnauthorizedException('Invalid credentials');

      throw new InternalServerErrorException(
        'Error trying to authenticate the user.',
      );
    }
  }
}
