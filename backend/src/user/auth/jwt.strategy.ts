import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { segredo } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: segredo,
      usernameField: 'documento',
      passwordField:'senha'
      
      
    });
  }

  async validate(payload: any) {
    console.log('arjjara')
    console.log(payload)
    return { userId: payload.sub, username: payload.username };
  }
}