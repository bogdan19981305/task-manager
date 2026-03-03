import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/register-dto.module';
import { RegisterService } from './register.service';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  async register(@Body() registerDto: RegisterDto) {
    return this.registerService.register(registerDto);
  }
}
