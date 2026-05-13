/**
 * OpenAPI fragments for `google-auth.routes.js`.
 * Swagger `servers.url` is `/api/v1`, so paths are `/google-auth/...`.
 */

/**
 * @openapi
 * /google-auth/login:
 *   post:
 *     tags: [Google auth]
 *     summary: Exchange Google ID token for API access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [googleToken]
 *             properties:
 *               googleToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Missing token
 *       401:
 *         description: Invalid Google token
 */

/**
 * @openapi
 * /google-auth/refresh:
 *   post:
 *     tags: [Google auth]
 *     summary: New access token via httpOnly refresh cookie
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Not authenticated
 */

/**
 * @openapi
 * /google-auth/logout:
 *   post:
 *     tags: [Google auth]
 *     summary: Clear refresh cookie
 *     responses:
 *       200:
 *         description: OK
 */

/**
 * @openapi
 * /google-auth/me:
 *   get:
 *     tags: [Google auth]
 *     summary: Current user (Bearer access token)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 */
