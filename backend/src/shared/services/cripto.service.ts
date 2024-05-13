import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
@Injectable()
export class CriptoService {
  async generateHash(value: string) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(value, saltOrRounds);
    return hashedPassword;
  }
  async compareHash(dbValue: string, informed: string) {
    return bcrypt.compare(informed, dbValue);
  }
  randomString() {
    return crypto.randomBytes(64).toString('hex');
  }
}
