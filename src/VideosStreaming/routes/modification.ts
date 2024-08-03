// routes/videoRoutes.ts
import express from 'express';
import { videoController } from '../controllers/modificationcontrller';
import { isValidToken } from '../../Admin/Controller/authAdminContrller';

const router = express.Router();

router.put('/videos', isValidToken,videoController.updateVideo);
router.delete('/videos', isValidToken,videoController.deleteVideo);

export default router;
