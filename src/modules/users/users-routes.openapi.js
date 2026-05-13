/**
 * OpenAPI fragments for `users.routes.js`.
 * Consumed by swagger-jsdoc via `config/swagger-config.js` (`apis` glob). Not imported at runtime.
 *
 * Swagger `servers.url` is `/api/v1`, so paths here are `/users/...`.
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         google_id: { type: string, nullable: true }
 *         email: { type: string, format: email }
 *         full_name: { type: string, nullable: true }
 *         picture_url: { type: string, nullable: true }
 *         is_active: { type: boolean }
 *         last_login_at: { type: string, format: date-time, nullable: true }
 *         created_at: { type: string, format: date-time }
 *         updated_at: { type: string, format: date-time }
 *         deleted_at: { type: string, format: date-time, nullable: true }
 *     UserCreate:
 *       type: object
 *       required: [email]
 *       properties:
 *         email: { type: string, format: email }
 *         full_name: { type: string }
 *         google_id: { type: string }
 *         picture_url: { type: string }
 *         is_active: { type: boolean }
 *         last_login_at: { type: string, format: date-time }
 *     UserUpdate:
 *       type: object
 *       properties:
 *         email: { type: string, format: email }
 *         full_name: { type: string, nullable: true }
 *         google_id: { type: string, nullable: true }
 *         picture_url: { type: string, nullable: true }
 *         is_active: { type: boolean }
 *         last_login_at: { type: string, format: date-time, nullable: true }
 */

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: List users (paginated)
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50, maximum: 200 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, default: 0, minimum: 0 }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *   post:
 *     tags: [Users]
 *     summary: Create user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Duplicate email or google_id
 */

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Not found
 *   put:
 *     tags: [Users]
 *     summary: Update user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Not found
 *       409:
 *         description: Duplicate email or google_id
 *   delete:
 *     tags: [Users]
 *     summary: Soft-delete user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         description: Not found
 */
