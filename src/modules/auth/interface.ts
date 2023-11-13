import { UserDto } from '../users/dto/user.dto';

export interface RequestWithUser extends Request {
  user: UserDto;
}

export interface JwtPayloadDataPayload {
  userId: number;
}

export interface JwtPayload extends JwtPayloadDataPayload {
  iat: number;
  exp: number;
}
