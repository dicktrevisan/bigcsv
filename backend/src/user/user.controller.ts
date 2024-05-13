import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';

import { AuthGuard } from '@nestjs/passport';
import { Prisma, User } from '@prisma/client';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  
  
  @UseGuards(LocalAuthGuard)
  @Post('auth')
  async login(@Request() req) {
    return this.userService.login(req.user)
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  
  @Post()
  create(@Body() user:Prisma.UserCreateInput) {
    return this.userService.createUser(user);
  }

  @Get()
  findAll() {
    this.userService.createUserPadrao()
    return this.userService.findUsers();
  }

  @Get(':documento')
  findOne(@Param('documento') documento: string) {
    return this.userService.findOne({documento});
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() user:User) {
    return this.userService.updateUser(id,user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.deleteUser({id});
  }
}
