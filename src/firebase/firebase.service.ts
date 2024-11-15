import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import fbAdminAppCredentials from './../../firebase-admin.json';

@Injectable()
export class FirebaseService {
  private app;
  private auth: Auth;

  constructor(private configService: ConfigService) {
    const firebaseConfig = {
      apiKey: this.configService.get<string>('apiKey'),
      authDomain: this.configService.get<string>('authDomain'),
      projectId: this.configService.get<string>('projectId'),
      storageBucket: this.configService.get<string>('storageBucket'),
      messagingSenderId: this.configService.get<string>('messagingSenderId'),
      appId: this.configService.get<string>('appId'),
    };

    this.app = initializeApp(firebaseConfig);
    admin.initializeApp({
      credential: admin.credential.cert(
        fbAdminAppCredentials as admin.ServiceAccount,
      ),
    });
    this.auth = getAuth(this.app);
  }

  getApp() {
    return this.app;
  }

  getAuth() {
    return this.auth;
  }
}
