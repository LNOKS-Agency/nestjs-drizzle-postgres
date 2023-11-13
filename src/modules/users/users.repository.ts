import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '../drizzle/drizzle.service';
import { CreateUserDto } from './dto/create-user.dto';
import { users } from '../drizzle/schema';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly db: DrizzleService) {}

  create(
    params: CreateUserDto & {
      roleId: number;
    },
  ) {
    return this.db.conn
      .insert(users)
      .values({
        email: params.email,
        password: params.password,
        firstName: params.firstName,
        lastName: params.lastName,
        roleId: params.roleId,
      })
      .returning();
  }

  async findAll() {
    return this.db.conn.select().from(users);
  }

  findByEmail(email: string) {
    return this.db.conn.query.users.findFirst({
      where: (users) => eq(users.email, email),
      with: {
        user_role: true,
      },
    });
  }

  findById(id: number) {
    return this.db.conn.query.users.findFirst({
      where: (users) => eq(users.id, id),
      with: {
        user_role: true,
      },
    });
  }

  async update(user: UpdateUserDto) {
    return (
      await this.db.conn
        .update(users)
        .set({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          password: user.password,
        })
        .where(eq(users.id, user.id))
        .returning()
    )[0];
  }

  async delete(id: number) {
    await this.db.conn.delete(users).where(eq(users.id, id)).execute();
  }

  async changePassword({ password, id }: { id: number; password: string }) {
    return (
      await this.db.conn
        .update(users)
        .set({
          password,
        })
        .where(eq(users.id, id))
        .returning()
    )[0];
  }

  async updateRole(updateUserRoleDto: UpdateUserRoleDto) {
    return (
      await this.db.conn
        .update(users)
        .set({
          roleId: updateUserRoleDto.roleId,
        })
        .where(eq(users.id, updateUserRoleDto.userId))
        .returning()
    )[0];
  }
}
