import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Activity } from './activity.model';
import { CreateActivityDTO } from './dto/create-activity.dto';
import { FetchActivitiesDTO } from './dto/fetch-activities.dto';
import { MongoIdDTO } from './dto/mongo-id.dto';
import { UpdateActivityDTO } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel('Activity') private readonly activityModel: Model<Activity>,
  ) {}

  async findActivities(fetchActivitiesDTO: FetchActivitiesDTO) {
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
    const searchObj = search ? { $text: { $search: search } } : {};

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

  async findActivity(mongoIdDTO: MongoIdDTO): Promise<Activity> {
    const { id } = mongoIdDTO;
    return await this.activityModel.findById({ _id: id }).exec();
  }

  async createActivity(
    createActivityDto: CreateActivityDTO,
  ): Promise<Activity> {
    const createdActivity = new this.activityModel(createActivityDto);
    return await createdActivity.save();
  }

  async updateActivity(
    mongoIdDTO: MongoIdDTO,
    updateActivityDto: UpdateActivityDTO,
  ) {
    const { id } = mongoIdDTO;

    return await this.activityModel.findByIdAndUpdate(id, updateActivityDto, {
      new: true,
      upsert: true,
    });
  }

  async deleteActivity(mongoIdDTO: MongoIdDTO) {
    const { id } = mongoIdDTO;
    await this.activityModel.deleteOne({ _id: id });
    return id;
  }
}
