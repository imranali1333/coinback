// src/services/videoService.ts

import { Prisma } from "@prisma/client";
import prisma from "../../Admin/utilities/prismaclient";

export class VideoService {
  async createVideo(adminId: number, title: string, description: string, duration: number, releaseDate: Date, genre: string, link: string) {
    try {
      const video = await prisma.streaming.create({
        data: {
          title,
          description,
          duration,
          genre,
          link,
          youtubevideos: {
            create: {
              authorId: adminId,
              published: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        },
        include: {
          youtubevideos: true,
        },
      });
      return video;
    } catch (error: any) {
      throw new Error(`Failed to create video: ${error.message}`);
    }
  }

  async getAllVideos(options: { skip: number; take: number; orderBy: { createdAt: 'asc' | 'desc' } }) {
    try {
      return await prisma.streaming.findMany({
        skip: options.skip,
        take: options.take,
        orderBy: {
          createdAt: options.orderBy.createdAt,
        },
        include: {
          youtubevideos: true,
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to fetch videos: ${error.message}`);
    }
  }

  async countVideos() {
    try {
      return await prisma.streaming.count();
    } catch (error: any) {
      throw new Error(`Failed to count videos: ${error.message}`);
    }
  }

  async getVideoById(id: number) {
    try {
      const video = await prisma.streaming.findUnique({
        where: { id },
        include: {
          youtubevideos: true,
        },
      });
      if (!video) {
        throw new Error(`No video found with ID: ${id}`);
      }
      return video;
    } catch (error: any) {
      throw new Error(`Failed to fetch video by ID: ${error.message}`);
    }
  }

  async searchVideos(query: string, fields: string[]) {
    try {
      const searchCriteria = {
        OR: fields.map(field => ({
          [field]: {
            contains: query,
            mode: 'insensitive',
          },
        })),
      };

      const videos = await prisma.streaming.findMany({
        where: searchCriteria,
        include: {
          youtubevideos: true,
        },
        orderBy: { title: 'asc' },
        take: 10,
      });

      return videos;
    } catch (error: any) {
      throw new Error(`Failed to search videos: ${error.message}`);
    }
  }

  async updateVideo(id: number, data: Partial<Prisma.StreamingUpdateInput>) {
    try {
      const video = await prisma.streaming.update({
        where: { id },
        data,
        include: {
          youtubevideos: true, // Include related data if necessary
        },
      });
      return video;
    } catch (error: any) {
      throw new Error(`Failed to update video: ${error.message}`);
    }
  }
  async deleteVideo(id: number) {
    try {
      const deletedVideo = await prisma.streaming.delete({
        where: { id },
        include: {
          youtubevideos: true, // Include related data if necessary
        },
      });
      return deletedVideo;
    } catch (error: any) {
      throw new Error(`Failed to delete video: ${error.message}`);
    }
  }
}

export const videoService = new VideoService();
