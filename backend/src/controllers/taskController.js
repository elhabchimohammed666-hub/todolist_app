import { Task } from '../models/Task.js';

/**
 * @desc    Récupérer toutes les tâches avec filtres, recherche et tri
 * @route   GET /api/tasks
 * @access  Public / Optionnel Authentifié
 */
export const getTasks = async (req, res, next) => {
  try {
    const {
      status,
      priority,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 50,
    } = req.query;

    // Construction dynamique du filtre MongoDB
    const filter = {};

    // Si l'utilisateur est authentifié, filtrer ses tâches ou tâches communes
    if (req.user?._id) {
      filter.$or = [{ userId: req.user._id }, { userId: null }];
    }

    // Filtre par statut
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Filtre par priorité
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }

    // Recherche plein texte ou par expression régulière
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
      ];
    }

    // Configuration du tri
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortConfig = {};
    sortConfig[sortBy] = sortOrder;

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = Math.min(parseInt(limit, 10) || 50, 100);
    const skip = (pageNum - 1) * limitNum;

    // Exécution en parallèle de la requête de comptage et de données
    const [tasks, totalTasks] = await Promise.all([
      Task.find(filter)
        .populate('userId', 'username email')
        .sort(sortConfig)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        total: totalTasks,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalTasks / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Récupérer une tâche par son ID
 * @route   GET /api/tasks/:id
 * @access  Public / Optionnel Authentifié
 */
export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id).populate('userId', 'username email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Tâche avec l'ID ${id} non trouvée`,
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Créer une nouvelle tâche
 * @route   POST /api/tasks
 * @access  Public / Optionnel Authentifié
 */
export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;

    const taskData = {
      title,
      description: description || '',
      status: status || 'À faire',
      priority: priority || 'Moyenne',
      dueDate: dueDate || null,
      tags: Array.isArray(tags) ? tags : [],
    };

    if (req.user?._id) {
      taskData.userId = req.user._id;
    }

    const newTask = await Task.create(taskData);

    res.status(201).json({
      success: true,
      message: 'Tâche créée avec succès',
      data: newTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mettre à jour une tâche existante (complète ou partielle)
 * @route   PUT /api/tasks/:id
 * @access  Public / Optionnel Authentifié
 */
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate, tags } = req.body;

    // Définir les champs autorisés à la modification
    const updatePayload = {};
    if (title !== undefined) updatePayload.title = title;
    if (description !== undefined) updatePayload.description = description;
    if (status !== undefined) updatePayload.status = status;
    if (priority !== undefined) updatePayload.priority = priority;
    if (dueDate !== undefined) updatePayload.dueDate = dueDate;
    if (tags !== undefined) updatePayload.tags = tags;

    // Options : runValidators garantit que les règles Mongoose sont respectées lors du update
    const updatedTask = await Task.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    }).populate('userId', 'username email');

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: `Impossible de mettre à jour : tâche avec l'ID ${id} non trouvée`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tâche mise à jour avec succès',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Supprimer une tâche
 * @route   DELETE /api/tasks/:id
 * @access  Public / Optionnel Authentifié
 */
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: `Impossible de supprimer : tâche avec l'ID ${id} non trouvée`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tâche supprimée avec succès',
      data: { id: deletedTask._id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Récupérer les statistiques d'ensemble des tâches
 * @route   GET /api/tasks/stats
 * @access  Public
 */
export const getTaskStats = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user?._id) {
      filter.$or = [{ userId: req.user._id }, { userId: null }];
    }

    const [total, todo, inProgress, done, highPriority] = await Promise.all([
      Task.countDocuments(filter),
      Task.countDocuments({ ...filter, status: 'À faire' }),
      Task.countDocuments({ ...filter, status: 'En cours' }),
      Task.countDocuments({ ...filter, status: 'Terminée' }),
      Task.countDocuments({ ...filter, priority: 'Haute' }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        todo,
        inProgress,
        done,
        highPriority,
        completionRate: total > 0 ? Math.round((done / total) * 100) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
