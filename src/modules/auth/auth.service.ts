import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SiteUser } from '../users/entities/site-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private readonly configService: ConfigService,
  ) {}

  async validate(email: string, password: string) {
    // Find user by email
    const siteUser = await this.usersService.findOneByEmail(email, {
      selectEmail: true,
      selectPassword: true,
    });

    // Throw error if user does not exist
    if (!siteUser) {
      throw new UnauthorizedException('Wrong credentials');
    }

    // Compare password if user exists
    const isPassMatch = await bcrypt.compare(password, siteUser.password);

    // Throw error if passwords does not match
    if (!isPassMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }

    // Return user if the credentials are correct
    return siteUser;
  }

  async genAuthTokens(siteUser: SiteUser) {
    const { secret: jwtSecret } = this.configService.get('jwt');

    // Create jwt payload
    const payload = { sub: siteUser.id };

    // Generat access token
    const accessToken = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: '15m',
    });

    // Generate refresh token
    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: '7d',
    });

    // Save refresh token to database
    await this.refreshTokenRepository
      .createQueryBuilder()
      .insert()
      .values({ token: refreshToken, siteUser })
      .execute();

    // Return access token and refresh token
    return { accessToken, refreshToken };
  }

  async refresh(refToken: string | undefined) {
    // Throw an error if refresh token cookie does not exist
    if (!refToken) {
      throw new BadRequestException('Refresh token cookie must be provided');
    }

    // Verify token
    let decode: any;
    try {
      decode = this.jwtService.verify(refToken, {
        secret: this.configService.get('jwt.secret'),
      });
    } catch (error) {
      throw new ForbiddenException('Refresh token has expired');
    }

    // Reuse detection
    const token = await this.refreshTokenRepository
      .createQueryBuilder('refreshToken')
      .leftJoinAndSelect('refreshToken.siteUser', 'siteUser')
      .where('refreshToken.token = :refToken', { refToken })
      .getOne();

    // Attack if refresh token is valid and does not exist in Database. Delete all refresh tokens related to the hacked user
    if (!token) {
      await this.refreshTokenRepository
        .createQueryBuilder('refresh_token')
        .delete()
        .where('refreshToken.siteUser.id = :userId', {
          userId: decode.userId,
        })
        .execute();

      throw new UnauthorizedException(
        'Refresh token has been used one time before',
      );
    }

    // Remove old refresh token from database
    await this.refreshTokenRepository.remove(token);

    // Generate new auth tokens
    const { accessToken, refreshToken } = await this.genAuthTokens(
      token.siteUser,
    );

    return { accessToken, refreshToken, user: token.siteUser };
  }
}
