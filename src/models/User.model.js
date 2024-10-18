// models/user.model.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Definimos el esquema del usuario con las validaciones actualizadas
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, 'El nombre debe de ser mayor a 3 caracteres'],
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, 'Los apellidos deben de ser mayor a 3 caracteres'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor, ingresa un correo electrónico válido',
      ],
    },
    telefono: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return /^\d{10}$/.test(value); // Valida que el teléfono tenga 10 dígitos
        },
        message: 'El teléfono debe tener exactamente 10 dígitos',
      },
    },
    fechadenacimiento: { type: Date, required: true },
    user: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: [6, 'El usuario debe tener al menos 6 caracteres'],
    },
    password: {
      type: String,
      required: true,
      minLength: [8, 'La contraseña debe tener al menos 8 caracteres'],
    },
    preguntaSecreta: {
      type: String,
      required: true,
    },
    respuestaSecreta: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Creamos el modelo basado en el esquema
const User = model('User', userSchema);

export default User;
