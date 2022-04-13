import { ConsoleLogger, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JWTGuard } from 'src/auth/guard/jwt.guard';

@Controller('user')
export class UserController {
  @UseGuards(JWTGuard)
  @Get('me')
  getMe(@Req() req: Request) {
      console.log({
          user: req.user
      })
    return req.user;
  }
}
