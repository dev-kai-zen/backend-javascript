/**
 * OpenAPI fragments for `user-logs.routes.js`.
 * Consumed by swagger-jsdoc via `config/swagger-config.js` (`apis` glob). Not imported at runtime.
 *
 * Swagger `servers.url` is `/api/v1`, so paths here are `/user-logs/...`.
 */

/**
 * @openapi
 * /user-logs:
 *   get:
 *     tags: [User logs]
 *     summary: List user logs
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema: { type: integer }
 *       - in: query
 *         name: action
 *         schema: { type: string }
 *       - in: query
 *         name: module
 *         schema: { type: string }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50, maximum: 200 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, default: 0, minimum: 0 }
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Server error
 *   post:
 *     tags: [User logs]
 *     summary: Create user log
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [action]
 *             properties:
 *               action: { type: string }
 *               userId: { type: integer, nullable: true }
 *               module: { type: string, nullable: true }
 *               description: { type: string, nullable: true }
 *               method: { type: string, nullable: true }
 *               route: { type: string, nullable: true }
 *               statusCode: { type: integer, nullable: true }
 *               ipAddress: { type: string, nullable: true }
 *               userAgent: { type: string, nullable: true }
 *               deviceType: { type: string, nullable: true }
 *               browser: { type: string, nullable: true }
 *               os: { type: string, nullable: true }
 *               sessionId: { type: string, nullable: true }
 *               metadata: { type: object, nullable: true }
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation error
 */
