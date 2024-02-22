import {
  Controller,
  Post,
  Body,
  Request,
  Response,
  UseGuards,
  HttpCode,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dtos';
import { UsersService } from '../users/users.service';
import { RequestWithUser } from '../../shared/interfaces';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @ApiOkResponse({
    description: 'The user has logged successfully',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'The user is unauthenticated' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: RequestWithUser,
    @Response() res: ExpressResponse,
    @Body() loginDto: LoginDto,
  ) {
    // Generate auth tokens
    const { accessToken, refreshToken } = await this.authService.genAuthTokens(
      req.user,
    );

    // Remove password from response
    const { password, ...rest } = req.user;

    return res
      .status(200)
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ user: rest, accessToken });
  }

  @ApiCreatedResponse({ description: 'The user has registered successfully' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({
    description: 'Neither email or username is taken',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Response() res: ExpressResponse,
  ) {
    // Create user
    const siteUser = await this.usersService.createOne(registerDto);

    // Generate auth tokens
    const { accessToken, refreshToken } =
      await this.authService.genAuthTokens(siteUser);

    // Remove password from response
    const { password, ...rest } = siteUser;

    return res
      .status(200)
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ user: rest, accessToken });
  }

  @ApiOkResponse({ description: 'Get a new refresh token and access token' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiForbiddenResponse({ description: 'The refresh token has been expired' })
  @ApiUnauthorizedResponse({
    description: 'The refresh token has been used one time before',
  })
  @Get('refresh')
  async refresh(
    @Request() req: ExpressRequest,
    @Response() res: ExpressResponse,
  ) {
    console.log(req.cookies);

    const { accessToken, refreshToken, user } = await this.authService.refresh(
      req.cookies.refresh_token,
    );

    const { password, ...rest } = user;
    return res
      .status(200)
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ user: rest, accessToken });
  }
}
