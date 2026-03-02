import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty({ enum: Role })
  role!: Role;

  @ApiProperty()
  timezone!: string;

  @ApiProperty()
  locale!: string;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty({ nullable: true })
  lastLoginAt!: string | null;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;

  static from(user: User): UserResponseDto {
    return {
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      timezone: user.timezone,
      locale: user.locale,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
