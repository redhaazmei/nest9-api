import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  signToken = async (userId: number, email: string) => {
    const payload = {
      sub: userId,
      email,
    };
    return {
      access_token: await this.jwt.signAsync(payload, {
        expiresIn: '1h',
        secret: this.config.get('JWT_SECRET'),
      }),
    };
  };

  signUp = async (dto: AuthDto) => {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
        },
      });
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'The email is already in use. Please use different email to sign up',
          );
        }
        throw error;
      }
    }
  };

  signIn = async (dto: AuthDto) => {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException(
        'No user found in the database. Please sign up first to continue.',
      );
    }

    const matches = await argon.verify(user.hash, dto.password);
    if (!matches) {
      throw new ForbiddenException(
        'The password you entered is incorrect. Please check your input password',
      );
    }
    return this.signToken(user.id, user.email);
  };
}
