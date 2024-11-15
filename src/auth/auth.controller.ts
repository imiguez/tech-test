import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CookieOptions, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

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
    return 'User created.';
  }

  @Public()
  @Post('login')
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
    return 'User logged.';
  }
}
