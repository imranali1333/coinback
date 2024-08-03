// services/videoService.ts

import prisma from "../../Admin/utilities/prismaclient";


export class VideoService {
  // Existing methods...

  async updateVideo(videoId: number, adminId: number, title: string, description: string, duration: number, releaseDate: Date, genre: string, link: string) {
    try {
      const video = await prisma.streaming.update({
        where: { id: videoId },
        data: {
          title,
          description,
          // duration,
          releaseDate,
          genre,
          link,
          youtubevideos: {
            create: {
              authorId: adminId,
              published: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          }
        },
        include: {
          youtubevideos: true
        }
      });
      return video;
    } catch (error:any) {
      throw new Error(`Failed to update video: ${error.message}`);
    }
  }

  async deleteVideo(videoId: number) {
    try {
      await prisma.streaming.delete({
        where: { id: videoId }
      });
      return { message: 'Video deleted successfully' };
    } catch (error:any) {
      throw new Error(`Failed to delete video: ${error.message}`);
    }
  }
}
