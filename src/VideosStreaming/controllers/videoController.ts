import { Request, Response } from 'express';
import { videoService } from '../services/postService';
declare module 'express' {
  interface Request {
    adminId?: number; // Define adminId as an optional number property
  }
}
export const videoController = {
  postVideon: async (req: Request, res: Response): Promise<void> => {
    const adminId = req.adminId;
    try {
      const { adminId, title, description, duration, releaseDate, genre, link } = req.body;

      if (!adminId || !title || !description || !duration || !genre || !link) {
        res.status(400).json({ message: 'All fields are required' });
        return;
      }
      const video = await videoService.createVideo(adminId, title, description, duration, releaseDate, genre, link);

      res.status(201).json({ message: 'Video posted successfully', video });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to post video' });
    }
  },

  getAllVideos: async (req: Request, res: Response): Promise<void> => { // Removed export keyword
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.items as string, 10) || 10;
    const skip = (page - 1) * limit;
  
    try {
      // Query the database for a list of all results with pagination and sorting
      const videosPromise = videoService.getAllVideos({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      });
  
      // Counting the total documents
      const countPromise = videoService.countVideos();
  
      // Resolving both promises
      const [videos, count] = await Promise.all([videosPromise, countPromise]);
  
      // Calculating total pages
      const pages = Math.ceil(count / limit);
  
      // Getting Pagination Object
      const pagination = { page, pages, count };
  
      if (count > 0) {
        res.status(200).json({
          success: true,
          result: videos,
          pagination,
          message: 'Successfully found all documents',
        });
      } else {
        res.status(203).json({
          success: false,
          result: [],
          pagination,
          message: 'Collection is empty',
        });
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).json({
        success: false,
        result: [],
        message: 'Oops, there is an error',
      });
    }
  },
};
