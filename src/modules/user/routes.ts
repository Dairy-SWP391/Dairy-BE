import { Router } from 'express';
import { wrapAsync } from '~/utils/handler';
import {
  accessTokenValidator,
  addAddressValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  updateAddressValidator,
  updateMeValidator,
  verifyForgotPasswordTokenValidator,
  roleValidator,
  updateUserValidator,
  deleteUserValidator,
  addProductToWishListValidator,
  deleteProductFromWishListValidator,
  getWishListValidator,
  getAllUsersValidator,
  updateRoleValidator,
} from './middlewares';
import {
  registerController,
  loginController,
  forgotPasswordController,
  verifyForgotPasswordTokenController,
  oAuthController,
  getMeController,
  resetPasswordController,
  updateMeController,
  accessTokenController,
  addAddressController,
  updateAddressController,
  getAllUsersController,
  getAllAddressesController,
  updateUsersController,
  deleteUserController,
  addProductToWishListController,
  getWishListController,
  refreshTokenController,
  deleteProductFromWishListController,
  getDefaultAddressController,
  getExpenseController,
  getExpensePerMonthController,
  updateRoleController,
} from './controllers';

const userRouter = Router();

userRouter.post('/register', registerValidator, wrapAsync(registerController));
userRouter.post('/login', loginValidator, wrapAsync(loginController));
userRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController));
userRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordTokenController),
);
userRouter.post(
  '/reset-password',
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator,
  wrapAsync(resetPasswordController),
);
userRouter.get('/oauth/google', wrapAsync(oAuthController));
userRouter.get('/me', accessTokenValidator, wrapAsync(getMeController));
userRouter.patch('/me', accessTokenValidator, updateMeValidator, wrapAsync(updateMeController));
userRouter.post('/refresh-token', refreshTokenValidator, wrapAsync(refreshTokenController));
userRouter.get('/access-token', refreshTokenValidator, wrapAsync(accessTokenController));

userRouter.post(
  '/add-address',
  accessTokenValidator,
  addAddressValidator,
  wrapAsync(addAddressController),
);
userRouter.get('/addresses', accessTokenValidator, wrapAsync(getAllAddressesController));
userRouter.get('/default-address', accessTokenValidator, wrapAsync(getDefaultAddressController));

userRouter.patch(
  '/address',
  accessTokenValidator,
  updateAddressValidator,
  wrapAsync(updateAddressController),
);
userRouter.get('/users', roleValidator, getAllUsersValidator, wrapAsync(getAllUsersController));
userRouter.patch(
  '/update-user',
  roleValidator,
  updateUserValidator,
  wrapAsync(updateUsersController),
);
userRouter.delete(
  '/delete-user',
  roleValidator,
  deleteUserValidator,
  wrapAsync(deleteUserController),
);

userRouter.post(
  '/add-wishlist',
  accessTokenValidator,
  addProductToWishListValidator,
  wrapAsync(addProductToWishListController),
);

userRouter.get(
  '/wishlist',
  accessTokenValidator,
  getWishListValidator,
  wrapAsync(getWishListController),
);
userRouter.delete(
  '/delete-wishlist',
  accessTokenValidator,
  deleteProductFromWishListValidator,
  wrapAsync(deleteProductFromWishListController),
);
userRouter.get('/total', accessTokenValidator, wrapAsync(getExpenseController));
userRouter.get('/total-per-month', accessTokenValidator, wrapAsync(getExpensePerMonthController));

userRouter.patch(
  '/role',
  accessTokenValidator,
  roleValidator,
  updateRoleValidator,
  wrapAsync(updateRoleController),
);

export default userRouter;
