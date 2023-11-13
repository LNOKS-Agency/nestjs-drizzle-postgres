import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../auth/guards/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from '../../enum/user-role';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Req() req: RequestWithUser) {
    return this.usersService.findById(req.user.id);
  }

  @Put()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':userId')
  @Roles(UserRole.ADMIN)
  delete(@Param() param: { userId: number }) {
    return this.usersService.delete(param.userId);
  }

  @Put('role')
  @Roles(UserRole.ADMIN)
  updateRole(@Body() body: UpdateUserRoleDto) {
    return this.usersService.updateRole(body);
  }
}
