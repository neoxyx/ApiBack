const User = require('../models/user.model');
const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

class UsersService {
  async registerUser(email, password, name) {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ApiError(400, 'El email ya está registrado');
      }

      // Crear nuevo usuario
      const user = await User.create({ email, password, name });
      
      // Eliminar el password del objeto devuelto
      const userObject = user.toObject();
      delete userObject.password;
      
      logger.info(`Usuario registrado: ${email}`);
      return userObject;
    } catch (error) {
      logger.error(`Error al registrar usuario: ${error.message}`);
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error al registrar usuario');
    }
  }

  async loginUser(email, password) {
    try {
      // Buscar usuario incluyendo el password (que normalmente está excluido)
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        throw new ApiError(401, 'Credenciales inválidas');
      }

      // Comparar contraseñas
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new ApiError(401, 'Credenciales inválidas');
      }

      // Eliminar el password del objeto devuelto
      const userObject = user.toObject();
      delete userObject.password;
      
      logger.info(`Usuario autenticado: ${email}`);
      return userObject;
    } catch (error) {
      logger.error(`Error en login: ${error.message}`);
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error al iniciar sesión');
    }
  }
}

module.exports = new UsersService();