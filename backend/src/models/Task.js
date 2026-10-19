import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre de la tâche est obligatoire'],
      trim: true,
      minlength: [2, 'Le titre doit comporter au moins 2 caractères'],
      maxlength: [120, 'Le titre ne peut pas dépasser 120 caractères'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères'],
      default: '',
    },
    status: {
      type: String,
      required: [true, 'Le statut est obligatoire'],
      enum: {
        values: ['À faire', 'En cours', 'Terminée'],
        message: 'Le statut "{VALUE}" est invalide (valeurs autorisées : À faire, En cours, Terminée)',
      },
      default: 'À faire',
      index: true,
    },
    priority: {
      type: String,
      required: [true, 'La priorité est obligatoire'],
      enum: {
        values: ['Basse', 'Moyenne', 'Haute'],
        message: 'La priorité "{VALUE}" est invalide (valeurs autorisées : Basse, Moyenne, Haute)',
      },
      default: 'Moyenne',
      index: true,
    },
    dueDate: {
      type: Date,
      default: null,
      index: true,
    },
    tags: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: [30, 'Un tag ne peut pas dépasser 30 caractères'],
        },
      ],
      default: [],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Permet un usage libre ou restreint selon l'authentification
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index composés pour des performances optimales lors des filtres et tris fréquents
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });
taskSchema.index({ userId: 1, priority: 1 });
taskSchema.index({ createdAt: -1 });

// Index de recherche textuelle pour le titre et la description
taskSchema.index({ title: 'text', description: 'text' });

export const Task = mongoose.model('Task', taskSchema);
