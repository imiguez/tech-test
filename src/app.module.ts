import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import configs from './configs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { FirebaseModule } from './firebase/firebase.module';
import { APP_GUARD } from '@nestjs/core';
import { FirebaseAuthGuard } from './auth/guards/firebase.auth.guard';
import { CoursesModule } from './courses/courses.module';
import { Course } from './courses/entities/course.entity';
import { UsersCoursesModule } from './users_courses/users_courses.module';
import { UsersCourses } from './users_courses/entities/users_courses.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configs],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('host'),
          port: configService.get<number>('port'),
          username: configService.get<string>('username'),
          password: configService.get<string>('password'),
          database: configService.get<string>('database'),
          entities: [User, Course, UsersCourses],
          autoLoadEntities: true,
          synchronize: true, // configService.get<string>('env') === 'dev', // This should be used in real projects.
        };
      },
    }),
    UsersModule,
    AuthModule,
    FirebaseModule,
    CoursesModule,
    UsersCoursesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: FirebaseAuthGuard,
    },
  ],
})
export class AppModule {}
