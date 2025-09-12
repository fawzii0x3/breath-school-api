// Using TypeScript UserModel
const { UserModel } = require("../infrastructure/models/UserModel");

/**
 * Firebase ID Token verification middleware
 * Verifies Firebase ID token and adds user information to request
 */
const firebaseAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No Firebase ID token provided'
      });
    }

    const idToken = authHeader.split('Bearer ')[1];

    if (!idToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization header format'
      });
    }

    // Get Firebase service from container
    const { Container } = require('../infrastructure/di/Container');
    const container = Container.getInstance();
    const firebaseService = container.getFirebaseService();

    // Verify the Firebase ID token
    const decodedToken = await firebaseService.verifyToken(idToken);
    
    // Debug logging
    console.log('Firebase token verification result:', decodedToken);
    
    if (!decodedToken || !decodedToken.success) {
      console.error('Firebase token verification failed:', decodedToken);
      return res.status(401).json({
        success: false,
        message: 'Firebase authentication failed',
        error: decodedToken?.error || 'Token verification failed'
      });
    }

    // Check if decodedToken has the required properties
    if (!decodedToken.decodedToken || !decodedToken.decodedToken.uid || !decodedToken.decodedToken.email) {
      console.error('Invalid decoded token structure:', decodedToken);
      return res.status(401).json({
        success: false,
        message: 'Invalid token structure',
        error: 'Token verification returned invalid data'
      });
    }

    // Extract the actual token data
    const tokenData = decodedToken.decodedToken;

    // Check if user exists in MongoDB by firebaseUid
    let user = null;
    try {
      // Add timeout to database queries to prevent hanging
      const dbQueryPromise = (async () => {
        // First try to find by firebaseUid
        user = await UserModel.findOne({ firebaseUid: tokenData.uid }, { password: 0, __v: 0, role: 0 });

        if (!user && tokenData.email) {
          // Fallback: try to find by email
          user = await UserModel.findOne({ email: tokenData.email }, { password: 0, __v: 0, role: 0 });

          // If user found by email but doesn't have firebaseUid, update it
          if (user && !user.firebaseUid) {
            user.firebaseUid = tokenData.uid;
            await user.save();
            console.log(`Updated user ${user.email} with Firebase UID: ${tokenData.uid}`);
          }
        }
      })();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database query timeout')), 3000)
      );

      await Promise.race([dbQueryPromise, timeoutPromise]);
    } catch (error) {
      console.error('Error checking user in database:', error);
      // Continue execution even if database query fails
    }

    // If user doesn't exist, create them
    if (!user && tokenData.email) {
      try {
        // Create user in MongoDB with firebaseUid (with timeout)
        const createUserPromise = (async () => {
          const newUser = new UserModel({
            email: tokenData.email,
            fullName: tokenData.name || tokenData.email.split('@')[0] || 'usuario',
            firebaseUid: tokenData.uid,
            role: 'user',
            picture: tokenData.picture || null
          });

          user = await newUser.save();
          console.log(`Created new user ${tokenData.uid} in MongoDB`);
        })();

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('User creation timeout')), 3000)
        );

        await Promise.race([createUserPromise, timeoutPromise]);

        // Also create user in Systeme.io (with timeout to prevent hanging)
        try {
          const { Container } = require('../infrastructure/di/Container');
          const container = Container.getInstance();
          const systemeService = container.getSystemeService();

          // Add timeout to prevent hanging
          const systemePromise = systemeService.createUser(tokenData.email, newUser.fullName);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Systeme.io creation timeout')), 5000)
          );

          const systemeResult = await Promise.race([systemePromise, timeoutPromise]);
          if (systemeResult.success) {
            console.log(`Created user ${tokenData.email} in Systeme.io with ID: ${systemeResult.userId}`);
          } else {
            console.warn(`Failed to create user ${tokenData.email} in Systeme.io:`, systemeResult.error);
          }
        } catch (systemeError) {
          console.error('Error creating user in Systeme.io:', systemeError.message);
          // Don't fail the request if Systeme.io creation fails
        }
      } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to create user account',
          error: error.message
        });
      }
    }

    // If user still doesn't exist after creation attempt, return error
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found and could not be created'
      });
    }

    // Add user information to request
    req.user = user;
    req.firebaseUser = {
      uid: tokenData.uid,
      email: tokenData.email,
      name: tokenData.name,
      picture: tokenData.picture,
      phone_number: tokenData.phone_number
    };

    next();
  } catch (error) {
    console.error('Firebase auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Firebase authentication failed',
      error: error.message
    });
  }
};

/**
 * Optional Firebase auth middleware - doesn't fail if no token provided
 */
const optionalFirebaseAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      req.firebaseUser = null;
      return next();
    }

    const idToken = authHeader.split('Bearer ')[1];

    if (!idToken) {
      req.user = null;
      req.firebaseUser = null;
      return next();
    }

    // Get Firebase service from container
    const { Container } = require('../infrastructure/di/Container');
    const container = Container.getInstance();
    const firebaseService = container.getFirebaseService();
    const userService = container.getUserService();

    // Verify the Firebase ID token
    const decodedToken = await firebaseService.verifyToken(idToken);

    if (!decodedToken || !tokenData.uid) {
      req.user = null;
      req.firebaseUser = null;
      return next();
    }

    // Check if user exists in MongoDB by firebaseUid
    let user = null;
    try {
      // Add timeout to database queries to prevent hanging
      const dbQueryPromise = (async () => {
        // First try to find by firebaseUid
        const userByFirebaseUid = await userService.getUserByFirebaseUid(tokenData.uid);
        if (userByFirebaseUid.success && userByFirebaseUid.data) {
          user = userByFirebaseUid.data;
        } else if (tokenData.email) {
          // Fallback: try to find by email
          const userByEmail = await userService.getUserByEmail(tokenData.email);
          if (userByEmail.success && userByEmail.data) {
            user = userByEmail.data;

            // If user found by email but doesn't have firebaseUid, update it
            if (user && !user.firebaseUid) {
              // Update the user with Firebase UID
              const updateResult = await userService.updateUser(user._id, { firebaseUid: tokenData.uid });
              if (updateResult.success) {
                user.firebaseUid = tokenData.uid;
                console.log(`Updated user ${user.email} with Firebase UID: ${tokenData.uid}`);
              }
            }
          }
        }
      })();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database query timeout')), 3000)
      );

      await Promise.race([dbQueryPromise, timeoutPromise]);
    } catch (error) {
      console.error('Error checking user in database:', error);
      // Continue execution even if database query fails
    }

    // Add user information to request
    req.user = user;
    req.firebaseUser = {
      uid: tokenData.uid,
      email: tokenData.email,
      name: tokenData.name,
      picture: tokenData.picture,
      phone_number: tokenData.phone_number
    };

    next();
  } catch (error) {
    console.error('Optional Firebase auth middleware error:', error);
    req.user = null;
    req.firebaseUser = null;
    next();
  }
};

module.exports = {
  firebaseAuth,
  optionalFirebaseAuth
};
