import { Controller, Post, Body, Res, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CookieOptions, Response } from 'express';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  async signUp(
    @Res({ passthrough: true }) res: Response,
    @Body() createAuthDto: CreateAuthDto,
  ) {
    const { session, expiresIn } = await this.authService.signUp(createAuthDto);
    const options: CookieOptions = {
      maxAge: expiresIn,
      httpOnly: true,
      // secure: this.configService.get<string>('env') === 'prod',
    };
    res.cookie('session', session, options);
    return { message: 'User created.' };
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() createAuthDto: CreateAuthDto,
  ) {
    const { session, expiresIn } = await this.authService.login(createAuthDto);
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      // secure: this.configService.get<string>('env') === 'prod',
    };
    res.cookie('session', session, options);
    return { message: 'User logged.' };
  }
}
