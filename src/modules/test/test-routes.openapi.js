/**
 * OpenAPI fragments for `test-routes.ts`.
 * Consumed by swagger-jsdoc via `config/swagger-config.ts` (`apis` glob); not imported at runtime.
 *
 * Swagger `servers.url` is `/api/v1`, so paths here are `/test/...`.
 */

/**
 * @openapi
 * /test:
 *   get:
 *     tags: [Test]
 *     summary: Sample greeting
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @openapi
 * /test/health:
 *   get:
 *     tags: [Test]
 *     summary: Health check
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 */
