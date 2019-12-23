import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { MongoError } from 'mongodb';
@Catch(MongoError)
export class MongoFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    switch (exception.code) {
      case 11000:
        return response.status(409).json({
          message: `User ${exception.keyValue.email} already exists.`,
          statusCode: 409,
        });

      default:
        return response
          .status(500)
          .json({ message: 'Internal error.', statusCode: 500 });
    }
  }
}
