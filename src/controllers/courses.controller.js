const Course = require("../models/courses.model");
const { systemeApiHelper } = require("../utils/systemeApiHelper");

// Get all courses with access control based on Systeme.io tags
exports.getCourses = async (req, res) => {
  try {
    const userEmail = req.user?.email;
    const courses = await Course.find().sort({ order: 1, createdAt: -1 });

    if (!userEmail) {
      // Para usuarios no autenticados, mostrar solo contenido gratuito
      const coursesWithLimitedAccess = courses.map((course) => {
        const processedCourse = course.toObject();
        processedCourse.sections = processedCourse.sections
          .map((section) => {
            if (section.isPremium) {
              section.lessons = section.lessons.filter(
                (lesson) => !lesson.isPremium
              );
            }
            section.lessons.forEach(lesson => lesson.completed = false);
            section.isCompleted = false; // Add section completion status
            return section;
          })
          .filter((section) => section.lessons.length > 0);
        return {
          ...processedCourse,
          hasAccess: false,
          progress: 0,
        };
      });

      return res.json({ courses: coursesWithLimitedAccess });
    }

    // Para usuarios autenticados, verificar acceso basado en tags de Systeme.io
    const userSystemeData = await systemeApiHelper.getUserByEmail(userEmail);
    const userTags = userSystemeData.success && userSystemeData.user?.tags 
      ? userSystemeData.user.tags.map(tag => tag.name) 
      : [];

    const coursesWithAccess = courses.map((course) => {
      const processedCourse = course.toObject();
      
      // Verificar si el usuario tiene acceso al curso basado en los tags
      const hasAccess = course.accessTags && course.accessTags.length > 0
        ? course.accessTags.some(tag => userTags.includes(tag))
        : true; // Si no hay tags de acceso, el curso es gratuito

      if (!hasAccess) {
        // Si no tiene acceso, mostrar solo contenido gratuito
        processedCourse.sections = processedCourse.sections
          .map((section) => {
            if (section.isPremium) {
              section.lessons = section.lessons.filter(
                (lesson) => !lesson.isPremium
              );
            }
            section.lessons.forEach(lesson => lesson.completed = false);
            section.isCompleted = false;
            return section;
          })
          .filter((section) => section.lessons.length > 0);
      } else {
        // Si tiene acceso, mostrar todo el contenido
        processedCourse.sections = processedCourse.sections.map((section) => {
          section.lessons.forEach(lesson => lesson.completed = false);
          section.isCompleted = false;
          return section;
        });
      }

      return {
        ...processedCourse,
        hasAccess,
        progress: 0,
      };
    });

    res.json({ courses: coursesWithAccess });
  } catch (error) {
    console.error("Error getting courses:", error);
    res.status(500).json({ message: "Error getting courses" });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error("Error getting course:", error);
    res.status(500).json({ message: "Error getting course" });
  }
};