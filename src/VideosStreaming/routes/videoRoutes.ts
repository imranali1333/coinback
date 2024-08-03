// routes/videoRoutes.ts
import express from 'express';
import { videoController } from '../controllers/videoController';  // Adjust the import path as needed
import { isValidToken, isValidTokens } from '../../Admin/Controller/authAdminContrller';
import { catchErrors } from '../../Admin/handlers/errorhandler';
import { getVideoById, searchVideos } from '../controllers/Serching';
import { updateVideo } from '../controllers/updateContrller';
import { deleteVideo } from '../controllers/deleteVideo';
import { postVideo } from '../controllers/PostVieo';
// import { authenticateAdmin } from '../../MiddleWare/Token/validateToken';

const router = express.Router();
router.get('/lead/read/:id',isValidTokens,getVideoById);
router.get('/lead/search',isValidTokens,searchVideos);

router.post('/lead/create',isValidTokens,postVideo);

router.get('/lead/list',isValidTokens,videoController.getAllVideos);
router.put('/lead/update/:id',isValidTokens,updateVideo);
router.route("/lead/delete/:id").delete(deleteVideo);
export default router;