const express = require("express");
const router = express.Router();
const passport = require("../middleware/passport");
const {
  createUser,
  listUsers,
  loginUser,
  whoami,
  refreshToken,
} = require("../controllers/auth");
const validator = require("../middleware/validator");
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API for managing user authentication
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           description: The user's email
 *         firstName:
 *           type: string
 *           description: The user's first name
 *         lastName:
 *           type: string
 *           description: The user's last name
 *       example:
 *         id: 60d0fe4f5311236168a109ca
 *         email: johndoe@example.com
 *         firstName: John
 *         lastName: Doe
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     NewUser:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *         firstName:
 *           type: string
 *           description: The user's first name
 *         lastName:
 *           type: string
 *           description: The user's last name
 *       example:
 *         email: johndoe@example.com
 *         password: john123
 *         firstName: John
 *         lastName: Doe
 */


/**
 * @swagger
 * /api/v1/auth:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.route("/").get(listUsers);

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router
  .route("/register")
  .post(validator.userValidationRules, validator.validate, createUser);

  /**
 * @swagger
 * /api/v1/auth/token:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: johndoe@example.com
 *               password: john123
 *     responses:
 *       200:
 *         description: User logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT token
 *                 refreshToken:
 *                   type: string
 *                   description: A refresh token
 */
router
  .route("/token")
  .post(validator.loginValidationRules, validator.validate, loginUser);

/**
 * @swagger
 * /api/v1/auth/token/refresh:
 *   post:
 *     summary: Refresh a user's token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New JWT token
 *                 refreshToken:
 *                   type: string
 *                   description: A refresh token
 */
router
  .route("/token/refresh")
  .post(
    validator.refreshTokenValidationRules,
    validator.validate,
    refreshToken
  );

/**
 * @swagger
 * /api/v1/auth/whoami:
 *   get:
 *     summary: Get the authenticated user's details
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: The authenticated user's details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router
  .route("/whoami")
  .get(passport.authenticate(["jwt", "basic"], { session: false }), whoami);

module.exports = router;
