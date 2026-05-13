/**
 * OpenAPI fragments for `refresh-token.routes.js`.
 * Consumed by swagger-jsdoc via `config/swagger-config.js` (`apis` glob). Not imported at runtime.
 *
 * Swagger `servers.url` is `/api/v1`, so paths here are `/refresh-tokens/...`.
 */

/**
 * @openapi
 * /refresh-tokens:
 *   get:
 *     tags: [Refresh tokens]
 *     summary: List refresh tokens
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Server error
 *   post:
 *     tags: [Refresh tokens]
 *     summary: Create refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, token, expiresAt]
 *             properties:
 *               userId: { type: integer, minimum: 1 }
 *               token: { type: string, maxLength: 512 }
 *               expiresAt: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation error
 *       409:
 *         description: Duplicate token
 */

/**
 * @openapi
 * /refresh-tokens/revoke:
 *   post:
 *     tags: [Refresh tokens]
 *     summary: Revoke refresh token by value (soft-delete)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token: { type: string, maxLength: 512 }
 *     responses:
 *       204:
 *         description: Revoked
 *       400:
 *         description: Validation error
 *       404:
 *         description: Not found
 */

/**
 * @openapi
 * /refresh-tokens/{id}:
 *   get:
 *     tags: [Refresh tokens]
 *     summary: Get refresh token by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Invalid id
 *       404:
 *         description: Not found
 *   delete:
 *     tags: [Refresh tokens]
 *     summary: Delete refresh token by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: No content
 *       400:
 *         description: Invalid id
 *       404:
 *         description: Not found
 */
