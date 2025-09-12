// Temporarily using direct model access until hexagonal architecture is fully integrated
const { UserModel } = require("../infrastructure/models/UserModel");

exports.addFavoriteMusic = async (req, res, next) => {
  try {
    const { userId, musicId } = req.body;
    // TODO: Implement music favorite logic
    res.json({ success: true, message: 'Music added to favorites' });
  } catch (error) {
    next(error);
  }
};

exports.addFavoriteVideo = async (req, res, next) => {
  try {
    const { userId, videoId } = req.body;
    // TODO: Implement video favorite logic
    res.json({ success: true, message: 'Video added to favorites' });
  } catch (error) {
    next(error);
  }
};

exports.getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    
    // Use the new check and create functionality
    const { Container } = require('../infrastructure/di/Container');
    const container = Container.getInstance();
    const userService = container.getUserService();
    
    const result = await userService.checkAndCreateUser(email);
    
    if (!result.success) {
      return res.status(404).json({ 
        success: false, 
        message: result.info 
      });
    }
    
    res.json({ 
      success: true, 
      data: result.data,
      created: result.created || false,
      message: result.info
    });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    // For /user/me route, user info comes from req.user (set by firebaseAuth middleware)
    if (req.user) {
      return res.json({ 
        success: true, 
        data: {
          _id: req.user._id,
          email: req.user.email,
          fullName: req.user.fullName,
          role: req.user.role,
          firebaseUid: req.user.firebaseUid,
          suscription: req.user.suscription,
          isStartSubscription: req.user.isStartSubscription,
          createdAt: req.user.createdAt,
          updatedAt: req.user.updatedAt,
          promotionDays: req.user.promotionDays,
          picture: req.firebaseUser?.picture || null
        }
      });
    }
    
    // Fallback: if no user in req.user, try to get from params (for other routes)
    const { userId, email } = req.params;
    if (userId) {
      const user = await UserModel.findById(userId, { password: 0, __v: 0, role: 0 });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.json({ success: true, data: user });
    }
    
    // If email is provided, use the new check and create functionality
    if (email) {
      const { Container } = require('../infrastructure/di/Container');
      const container = Container.getInstance();
      const userService = container.getUserService();
      
      const result = await userService.checkAndCreateUser(email);
      
      if (!result.success) {
        return res.status(404).json({ 
          success: false, 
          message: result.info 
        });
      }
      
      return res.json({ 
        success: true, 
        data: result.data,
        created: result.created || false,
        message: result.info
      });
    }
    
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  } catch (error) {
    next(error);
  }
};

exports.updateSubscriptionStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { isStartSubscription } = req.body;
    
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { isStartSubscription },
      { new: true, select: '-password -__v -role' }
    );
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, message: 'Subscription status updated', user });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};


