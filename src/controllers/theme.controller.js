const Theme = require("../models/theme.model");

// Get all themes
exports.getThemes = async (req, res) => {
    try {
      const themes = await Theme.find();
      res.status(200).json(themes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Create new theme
  exports.createTheme = async (req, res) => {
    try {
      const { name, colors } = req.body;
  
      // Check if theme name already exists
      const existingTheme = await Theme.findOne({ name });
      if (existingTheme) {
        return res.status(400).json({ message: 'Theme name already exists' });
      }
  
      const theme = new Theme({
        name,
        colors
      });
  
      const savedTheme = await theme.save();
      res.status(201).json(savedTheme);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Get theme by ID
  exports.getThemeById = async (req, res) => {
    try {
      const theme = await Theme.findById(req.params.id);
      if (!theme) {
        return res.status(404).json({ message: 'Theme not found' });
      }
      res.status(200).json(theme);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Update theme
  exports.updateTheme = async (req, res) => {
    try {
      const { name, colors } = req.body;
      const theme = await Theme.findById(req.params.id);
      
      if (!theme) {
        return res.status(404).json({ message: 'Theme not found' });
      }
      
      // Check if new name already exists (excluding current theme)
      if (name && name !== theme.name) {
        const existingTheme = await Theme.findOne({ name, _id: { $ne: req.params.id } });
        if (existingTheme) {
          return res.status(400).json({ message: 'Theme name already exists' });
        }
      }
      
      if (name) theme.name = name;
      if (colors) theme.colors = colors;
      
      const updatedTheme = await theme.save();
      res.status(200).json(updatedTheme);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Delete theme
  exports.deleteTheme = async (req, res) => {
    try {
      const theme = await Theme.findById(req.params.id);
      
      if (!theme) {
        return res.status(404).json({ message: 'Theme not found' });
      }
      
      await Theme.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Theme deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };