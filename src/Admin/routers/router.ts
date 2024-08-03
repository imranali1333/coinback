import express from 'express';
import { catchErrors } from '../handlers/errorhandler';

import * as adminController from '../Controller/Admin.contrller';
import * as adminControllerAuth from '../Controller/authAdminContrller';

const router = express.Router();

//_______________________________ Admin management_______________________________
router.route("/register").post(catchErrors(adminControllerAuth.register));
router.route("/login").post(catchErrors(adminControllerAuth.login));
router.route("/logout").post(adminControllerAuth.isValidToken, catchErrors(adminControllerAuth.logout));

// for development & production don't use this line router.route("/login").post(catchErrors(loginDemo)); (you should remove it) , this is just demo login contoller
// router.route("/login").post(catchErrors(loginDemo));

router.route('/admin/create').post(catchErrors(adminController.create));
router.route('/admin/read/:id').get(catchErrors(adminController.read));
router.route('/admin/update/:id').patch(catchErrors(adminController.update));
router.route('/admin/delete/:id').delete(catchErrors(adminController.deleteAdmin));
router.route('/admin/search').get(catchErrors(adminController.search));
router.route('/admin/list').get(catchErrors(adminController.list));
router.route('/admin/password-update/:id')
.patch(catchErrors(adminController.updatePassword));
router.route("/login").post(catchErrors(adminControllerAuth.login));
router.route("/register").post(catchErrors(adminControllerAuth.register));
router.route("/logout").post(adminControllerAuth.isValidToken, catchErrors(adminControllerAuth.logout));
// _________________________________________________________________________________

export default router;