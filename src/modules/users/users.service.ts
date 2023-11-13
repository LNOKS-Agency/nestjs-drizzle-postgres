import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { RoleService } from '../role/role.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAlreadyExistException } from '../../exception/user-already-exist.exception';
import { UserDto } from './dto/user.dto';
import { UserRole } from '../../enum/user-role';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { RoleUtil } from '../../utils/role.util';

@Injectable()
export class UsersService {
  private readonly passwordEncoder = bcrypt;

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly roleService: RoleService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const isEmailExists = await this.existsByEmail(createUserDto.email);
    if (isEmailExists) {
      throw new UserAlreadyExistException(
        `User with such email ${createUserDto.email} already exist`,
      );
    }

    const role = await this.roleService.findByName(UserRole.USER);
    const hashedPassword = await this.hashPassword(createUserDto.password);
    const savedUser = (
      await this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
        roleId: role.id,
      })
    )[0];

    return new UserDto({
      id: savedUser.id,
      email: savedUser.email,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      role: RoleUtil.normalizeRole(role.name),
      password: savedUser.password,
    });
  }

  hashPassword(password: string) {
    return this.passwordEncoder.hash(password, 10);
  }

  findAll() {
    return this.usersRepository.findAll();
  }

  async existsByEmail(email: string): Promise<boolean> {
    return Boolean(await this.usersRepository.findByEmail(email));
  }

  async findByEmail(email: string): Promise<UserDto> {
    const user = await this.usersRepository.findByEmail(email);
    return new UserDto({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: RoleUtil.normalizeRole(user.user_role.name),
      password: user.password,
    });
  }

  async findById(id: number): Promise<UserDto> {
    const user = await this.usersRepository.findById(id);
    return new UserDto({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: RoleUtil.normalizeRole(user.user_role.name),
      password: user.password,
    });
  }

  async getUserPasswordByEmail(email: string): Promise<string> {
    const user = await this.usersRepository.findByEmail(email);
    return user.password;
  }

  async update(user: UpdateUserDto): Promise<UserDto> {
    const savedUser = await this.usersRepository.update(user);

    return new UserDto({
      id: savedUser.id,
      email: savedUser.email,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      password: savedUser.password,
    });
  }

  delete(userId: number) {
    return this.usersRepository.delete(userId);
  }

  async changePassword({
    newPassword,
    userId,
  }: {
    userId: number;
    newPassword: string;
  }) {
    const hashedPassword = await this.hashPassword(newPassword);
    return this.usersRepository.changePassword({
      password: hashedPassword,
      id: userId,
    });
  }

  async updateRole(updateUserRoleDto: UpdateUserRoleDto) {
    return this.usersRepository.updateRole(updateUserRoleDto);
  }
}
