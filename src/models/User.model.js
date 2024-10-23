import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Definimos el esquema del usuario
const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  telefono: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^\d{10}$/.test(value);  // Valida que el teléfono tenga 10 dígitos
      },
      message: 'El teléfono debe tener exactamente 10 dígitos'
    }
  },
  fechadenacimiento: { type: Date, required: true },
  user: { type: String, required: true, unique: true, trim: true, minLength: 6 },
  preguntaSecreta: { type: String, required: true },
  respuestaSecreta: { type: String, required: true },
  password: { type: String, required: true },  // Campo de contraseña encriptada
  verified: { type: Boolean, default: false },  // Usuario verificado
  role: { type: String, default: 'publico' }, // Rol del usuario, 'admin' o 'publico'

  // Nuevos campos para el bloqueo del usuario
  failedLoginAttempts: { type: Number, default: 0 },  // Intentos fallidos de login
  lockUntil: { type: Date },  // Fecha hasta la cual el usuario está bloqueado

  deleted: { type: Boolean, default: false }  // Eliminación lógica del usuario
}, {
  timestamps: true,
  versionKey: false
});

const User = model('User', userSchema);

export default User;
