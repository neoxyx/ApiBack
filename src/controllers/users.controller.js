const usersService = require('../services/users.services');
const ApiError = require('../utils/apiError');

class UsersController {
  async register(req, res, next) {
    try {
      const { email, password, name } = req.body;

      // Validación básica
      if (!email || !password || !name) {
        throw new ApiError(400, 'Email, contraseña y nombre son requeridos');
      }

      const user = await usersService.registerUser(email, password, name);
      
      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ApiError(400, 'Email y contraseña son requeridos');
      }

      const user = await usersService.loginUser(email, password);
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UsersController();