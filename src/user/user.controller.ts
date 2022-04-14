import { ConsoleLogger, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from 'src/auth/decorator';
import { JWTGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JWTGuard)
@Controller('user')
export class UserController {
  @Get('me')
  getMe(@GetUser() user: User, @GetUser('id') userId: number) {
    console.log({
      userId,
    });
    return user;
  }
}
