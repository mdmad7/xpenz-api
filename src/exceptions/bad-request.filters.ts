import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';

@Catch(BadRequestException)
export class BadRequestFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    if (Array.isArray(exception.message.message)) {
      return response.status(422).json({
        statusCode: 422,
        message: 'Unprocessable Entity',
        errors: exception.message.message.reduce((acc, cur) => {
          acc.push({
            property: cur.property,
            messages: Object.values(cur.constraints),
          });
          return acc;
        }, []),
      });
    }
    return response.status(400).json(exception.getResponse());
  }
}
