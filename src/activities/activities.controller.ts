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
import { AuthGuard } from '@nestjs/passport';
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
