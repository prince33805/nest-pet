import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private usersService: UsersService) { }

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByUsername(username)
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (user && isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
      throw new UnauthorizedException('Invalid credentials');
    } catch (error) {
      throw new Error('Failed to Validate User.');
    }
  }

  async login(user: any) {
    try {
      const payload = { username: user.username, sub: user.id };
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: '1d',
        secret: process.env.JWT_SECRET_KEY 
      });
      await this.usersService.saveRefreshToken(user.id, refreshToken);

      return {
        accessToken: this.jwtService.sign(payload, {
          expiresIn: '1h',
          secret: process.env.JWT_SECRET_KEY
        }),
        refreshToken,
      };
    } catch (error) {
      throw new Error('Failed to Login.');
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      console.log("refreshToken");
      // Verify the refresh token using the secret
      const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_SECRET_KEY });
      const user = await this.usersService.findById(payload.sub);
      if (!user || !(await bcrypt.compare(refreshToken, user.refreshToken))) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      // Issue new tokens
      const newAccessToken = this.jwtService.sign({ username: user.username, sub: user.id }, {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET_KEY 
      });
      const newRefreshToken = this.jwtService.sign({ username: user.username, sub: user.id }, {
        expiresIn: '1d',
        secret: process.env.JWT_SECRET_KEY 
      });
      // Save the new refresh token
      await this.usersService.saveRefreshToken(user.id, newRefreshToken);
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error('Failed to refreshToken.');
    }
  }

}
