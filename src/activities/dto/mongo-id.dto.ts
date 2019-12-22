import { IsMongoId, IsNotEmpty } from 'class-validator';

export class MongoIdDTO {
  @IsMongoId() @IsNotEmpty() id: string;
}
