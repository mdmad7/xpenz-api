import {
  Controller,
  Post,
  Body,
  UseFilters,
  Get,
  Query,
  Param,
  Delete,
  Request,
  NotFoundException,
  Patch,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiQuery,
  ApiBearerAuth,
  ApiResponse,
  ApiHeader,
} from '@nestjs/swagger';

import { AuthGuard } from '@nestjs/passport';
import { ActivitiesService } from './activities.service';
import { CreateActivityDTO } from './dto/create-activity.dto';
import { BadRequestFilter } from 'src/exceptions/bad-request.filters';
import { FetchActivitiesDTO } from './dto/fetch-activities.dto';
import { MongoIdDTO } from './dto/mongo-id.dto';
import { UpdateActivityDTO } from './dto/update-activity.dto';
import { Activity } from './activity.model';

@ApiBearerAuth()
@Controller('activities')
@UseFilters(BadRequestFilter)
export class ActivitiesController {
  constructor(private activitiesService: ActivitiesService) {}

  @ApiHeader({
    name: 'Authorization',
    description: 'Auth token with Bearer',
  })
  @ApiResponse({
    status: 200,
    description: 'Indicates the request for activities completed successfully.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Fetch successful' },
        statusCode: { type: 'number', example: 200 },
        data: {
          type: 'array',
          items: {
            type: 'object',
            // example:,
          },
        },
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findActivities(
    @Request() req,
    @Query() fetchActivitiesDTO: FetchActivitiesDTO,
  ) {
    const data = await this.activitiesService.findActivities(
      fetchActivitiesDTO,
      req.user,
    );
    return {
      statusCode: 200,
      message: 'Fetch successful',
      ...data,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async findActivity(@Request() req, @Param() mongoIdDTO: MongoIdDTO) {
    const data = await this.activitiesService.findActivity(
      mongoIdDTO,
      req.user,
    );
    if (!data) {
      throw new NotFoundException({
        statusCode: 404,
        error: `Activity ${mongoIdDTO.id} not found`,
      });
    }
    return {
      statusCode: 200,
      message: 'Fetch success',
      data,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createActivity(
    @Request() req,
    @Body() createActivityDTO: CreateActivityDTO,
  ) {
    const data = await this.activitiesService.createActivity(
      createActivityDTO,
      req.user,
    );
    return {
      statusCode: 201,
      message: 'Create successful',
      data,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async deleteActivity(@Request() req, @Param() mongoIdDTO: MongoIdDTO) {
    const data = await this.activitiesService.deleteActivity(
      mongoIdDTO,
      req.user,
    );
    return {
      statusCode: 200,
      message: `Activity ${data} deleted successfully`,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id')
  async updateActivity(
    @Request() req,
    @Param() mongoIdDTO: MongoIdDTO,
    @Body() updateActivityDTO: UpdateActivityDTO,
  ) {
    let data: Promise<Activity>;

    if (!Object.values(updateActivityDTO).length) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Bad Request',
        error: `Must provide at least one parameter to update`,
      });
    }

    data = await this.activitiesService.updateActivity(
      mongoIdDTO,
      updateActivityDTO,
      req.user,
    );

    if (!data) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Not Found',
        error: `Activity with provided id does not exist`,
      });
    }

    return {
      statusCode: 200,
      message: 'Update successful',
      data,
    };
  }
}
