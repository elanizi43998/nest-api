import { ConsoleLogger, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { JWTGuard } from '../auth/guard/jwt.guard';

@UseGuards(JWTGuard)
@Controller('user')
export class UserController {

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
}
