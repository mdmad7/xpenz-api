import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Activity } from './activity.model';
import { CreateActivityDTO } from './dto/create-activity.dto';
import { FetchActivitiesDTO } from './dto/fetch-activities.dto';
import { MongoIdDTO } from './dto/mongo-id.dto';
import { UpdateActivityDTO } from './dto/update-activity.dto';
import { User } from 'src/users/user.model';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel('Activity') private readonly activityModel: Model<Activity>,
  ) {}

  async findActivities(fetchActivitiesDTO: FetchActivitiesDTO, user: User) {
    const search = fetchActivitiesDTO.search;
    const limit = parseInt(
      fetchActivitiesDTO.size || `${process.env.PAGE_SIZE}`,
      10,
    );
    let page = parseInt(fetchActivitiesDTO.page || `${process.env.PAGE}`, 10);
    if (isNaN(page) || page < 1) {
      page = 1;
    }

    const skip = page > 0 ? (page - 1) * limit : 0;
    const searchObj = search
      ? { $text: { $search: search }, owner: user.id }
      : { owner: user.id };

    const data = await this.activityModel
      .find(searchObj)
      .limit(limit)
      .skip(skip)
      .exec();

    const total = await this.activityModel.countDocuments(searchObj);
    return {
      data,
      meta: {
        page,
        pageSize: limit,
        count: data.length,
        total,
      },
    };
  }

  async findActivity(mongoIdDTO: MongoIdDTO, user: User): Promise<Activity> {
    const { id } = mongoIdDTO;
    return await this.activityModel.findOne({ _id: id, owner: user.id }).exec();
  }

  async createActivity(
    createActivityDto: CreateActivityDTO,
    user: User,
  ): Promise<Activity> {
    const createdActivity = new this.activityModel({
      ...createActivityDto,
      owner: user.id,
    });
    return await createdActivity.save();
  }

  async updateActivity(
    mongoIdDTO: MongoIdDTO,
    updateActivityDto: UpdateActivityDTO,
    user: User,
  ) {
    const { id } = mongoIdDTO;

    return await this.activityModel.findOneAndUpdate(
      { _id: id, owner: user.id },
      updateActivityDto,
    );
  }

  async deleteActivity(mongoIdDTO: MongoIdDTO, user: User) {
    const { id } = mongoIdDTO;
    const deleted = await this.activityModel.deleteOne({
      _id: id,
      owner: user.id,
    });

    if (deleted.deletedCount) {
      return id;
    }

    throw new NotFoundException({
      statusCode: 404,
      error: `Activity ${id} not found`,
    });
  }
}
