import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findAll() { return this.repo.find({ select: ['id', 'email', 'name', 'userType', 'language', 'companyName', 'createdAt'] }); }
  findOne(id: string) { return this.repo.findOne({ where: { id } }); }
  update(id: string, dto: any) { return this.repo.update(id, dto); }
}
