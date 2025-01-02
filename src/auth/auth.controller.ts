import { Controller, Post, Body, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) { }

  @Post('register')
  async register(@Body() body: { username: string; email: string; password: string }) {
    const { username, email, password } = body;

    try {
      // Check if username or email is already taken
      const existingUser = await this.usersService.findByUsername(username) || await this.usersService.findByEmail(email);
      if (existingUser) {
        throw new BadRequestException('Username or email already exists');
      }
      // Create the user
      return this.usersService.create({ username, email, password });
    } catch (error) {
      throw new InternalServerErrorException('Username or email already exists');
    }
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    try {
      const user = await this.authService.validateUser(body.username, body.password);
      return this.authService.login(user);
    } catch (error) {
      throw new InternalServerErrorException('Could not login.');
    }
  }

  @Post('refresh')
  async refreshToken(@Body() body: { refreshToken: string }) {
    try {
      return this.authService.refreshToken(body.refreshToken);
    } catch (error) {
      throw new InternalServerErrorException('Could not refresh.');
    }
  }
}
