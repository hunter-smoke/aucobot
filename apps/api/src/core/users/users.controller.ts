import { Controller, Get, Post, Body } from "@nestjs/common";
import type { UserResponse } from "@aucobot/shared";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<UserResponse[]> {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() dto: CreateUserDto): Promise<UserResponse> {
    return this.usersService.create(dto);
  }
}
