import {
  Controller,
  Post,
  Body,
  UseFilters,
  Get,
  Query,
  Param,
  Delete,
  NotFoundException,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDTO } from './dto/create-activity.dto';
import { BadRequestFilter } from 'src/exceptions/bad-request.filters';
import { FetchActivitiesDTO } from './dto/fetch-activities.dto';
import { MongoIdDTO } from './dto/mongo-id.dto';
import { UpdateActivityDTO } from './dto/update-activity.dto';
import { Activity } from './activity.model';

@Controller('activities')
@UseFilters(BadRequestFilter)
export class ActivitiesController {
  constructor(private activitiesService: ActivitiesService) {}
  @Get()
  async findActivities(@Query() fetchActivitiesDTO: FetchActivitiesDTO) {
    const data = await this.activitiesService.findActivities(
      fetchActivitiesDTO,
    );
    return {
      statusCode: 200,
      message: 'Fetch successful',
      ...data,
    };
  }

  @Get('/:id')
  async findActivity(@Param() mongoIdDTO: MongoIdDTO) {
    const data = await this.activitiesService.findActivity(mongoIdDTO);
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

  @Post()
  async createActivity(@Body() createActivityDTO: CreateActivityDTO) {
    const data = await this.activitiesService.createActivity(createActivityDTO);
    return {
      statusCode: 201,
      message: 'Create successful',
      data,
    };
  }

  @Delete('/:id')
  async deleteActivity(@Param() mongoIdDTO: MongoIdDTO) {
    const data = await this.activitiesService.deleteActivity(mongoIdDTO);
    return {
      statusCode: 200,
      message: `Activity ${data} deleted successfully`,
    };
  }

  @Patch('/:id')
  async updateActivity(
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
    );
    return {
      statusCode: 200,
      message: 'Update successful',
      data,
    };
  }
}
