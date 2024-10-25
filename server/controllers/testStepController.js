const { createTestStep, findTestStepsByTestId, findTestStepById, updateTestStepById, deleteTestStepById } = require('../models/testStepModel');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer');


// Créer un nouveau step de test
const createTestStepHandler = async (req, res) => {
  try {
    const { test_id, description } = req.body;

    if (!test_id || !description) {
      return res.status(400).json({ message: "Les champs 'test_id' et 'description' sont requis" });
    }

    const stepId = uuidv4();
    let images = [];

    // Upload des images sur Cloudinary
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path);
          images.push(result.secure_url);
        } catch (uploadError) {
          console.error(`Erreur lors du téléchargement de l'image vers Cloudinary: ${uploadError.message}`);
          return res.status(500).json({ message: "Erreur lors de l'upload de l'image", error: uploadError.message });
        }
      }
    }

    const stepData = {
      step_id: stepId,
      test_id,
      description,
      images,
      createdAt: new Date(),
      updatedAt: null,
    };

    // Insertion avec gestion des erreurs
    const result = await createTestStep(stepData);

    if (!result || !result.insertedId) {
      return res.status(500).json({ message: "Erreur inconnue lors de la création du step de test" });
    }

    res.status(201).json({ message: "Step de test créé avec succès", step: stepData });
  } catch (err) {
    console.error("Erreur lors de la création du step de test :", err);
    res.status(500).json({ message: "Erreur lors de la création du step de test", error: err.message });
  }
};

// Récupérer un step de test par ID
const getTestStepByIdHandler = async (req, res) => {
    try {
      const stepId = req.params.id; // Récupérer step_id depuis les paramètres de l'URL
      const step = await findTestStepById(stepId);
  
      if (!step) {
        return res.status(404).json({ message: "Step de test non trouvé" });
      }
  
      res.status(200).json(step);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération du step de test", error: err });
    }
  };

// Récupérer tous les steps liés à un test
const getTestStepsByTestIdHandler = async (req, res) => {
  try {
    const testId = req.params.test_id;
    const steps = await findTestStepsByTestId(testId);

    if (!steps || steps.length === 0) {
      return res.status(404).json({ message: "Aucun step trouvé pour ce test" });
    }

    res.status(200).json(steps);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des steps", error: err });
  }
};

// Mettre à jour un step de test par ID
// Mettre à jour un step de test par ID
const updateTestStepHandler = async (req, res) => {
  try {
    const stepId = req.params.id;
    const { description } = req.body;

    // Récupérer l'étape de test actuelle pour obtenir ses informations
    const existingStep = await findTestStepById(stepId);
    if (!existingStep) {
      return res.status(404).json({ message: "Step de test non trouvé" });
    }

    // Initialiser les images avec celles existantes
    let updatedImages = existingStep.images;

    // Si de nouvelles images sont fournies, remplacer les anciennes
    if (req.files && req.files.length > 0) {
      // Supprimer les anciennes images de Cloudinary
      for (let imagePath of existingStep.images) {
        const publicId = extractPublicIdFromUrl(imagePath);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }

      // Télécharger les nouvelles images sur Cloudinary
      updatedImages = [];
      for (let file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path);
          updatedImages.push(result.secure_url);
        } catch (uploadError) {
          console.error(`Erreur lors du téléchargement de l'image vers Cloudinary: ${uploadError.message}`);
          return res.status(500).json({ message: "Erreur lors de l'upload de l'image", error: uploadError.message });
        }
      }
    }

    // Mise à jour des données de l'étape
    const updateData = {
      description,
      images: updatedImages,
      updatedAt: new Date(),
    };

    // Mise à jour dans la base de données
    const result = await updateTestStepById(stepId, updateData);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Step de test non trouvé" });
    }

    res.status(200).json({ message: "Step de test mis à jour avec succès", step: updateData });
  } catch (err) {
    console.error("Erreur lors de la mise à jour du step de test:", err);
    res.status(500).json({ message: "Erreur lors de la mise à jour du step de test", error: err.message });
  }
};

// Utilitaire pour extraire l'ID public de l'image à partir de l'URL Cloudinary
const extractPublicIdFromUrl = (url) => {
  try {
    const parts = url.split('/');
    const publicIdWithExtension = parts[parts.length - 1];
    return publicIdWithExtension.split('.')[0]; // Suppression de l'extension du fichier
  } catch (err) {
    console.error("Erreur lors de l'extraction de l'ID public:", err);
    return null;
  }
};

// Supprimer un step de test par ID
const deleteTestStepHandler = async (req, res) => {
  try {
    const stepId = req.params.id;

    // Récupérer l'étape de test actuelle pour obtenir ses informations
    const existingStep = await findTestStepById(stepId);
    if (!existingStep) {
      return res.status(404).json({ message: "Step de test non trouvé" });
    }

    // Supprimer les images associées du step sur Cloudinary
    if (existingStep.images && existingStep.images.length > 0) {
      for (let imagePath of existingStep.images) {
        const publicId = extractPublicIdFromUrl(imagePath);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
    }

    // Suppression de l'étape dans la base de données
    const result = await deleteTestStepById(stepId);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Step de test non trouvé" });
    }

    res.status(200).json({ message: "Step de test et images supprimés avec succès" });
  } catch (err) {
    console.error("Erreur lors de la suppression du step de test:", err);
    res.status(500).json({ message: "Erreur lors de la suppression du step de test", error: err.message });
  }
};

module.exports = {
  createTestStepHandler,
  getTestStepsByTestIdHandler,
  updateTestStepHandler,
  deleteTestStepHandler,
  getTestStepByIdHandler,
};
