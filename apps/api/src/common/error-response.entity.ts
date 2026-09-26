import { ApiProperty } from '@nestjs/swagger';

/** Shape of every error response (NestJS's built-in HttpException format). */
export class ErrorResponse {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    example: ['price must be a positive number'],
    description: 'A message, or a list of messages for validation errors',
  })
  message: string | string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}
