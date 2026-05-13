/**
 * OpenAPI fragments for `audit-logs.routes.js`.
 * Consumed by swagger-jsdoc via `config/swagger-config.js` (`apis` glob). Not imported at runtime.
 *
 * Swagger `servers.url` is `/api/v1`, so paths here are `/audit-logs/...`.
 */

/**
 * @openapi
 * /audit-logs:
 *   get:
 *     tags: [Audit logs]
 *     summary: List audit logs
 *     parameters:
 *       - in: query
 *         name: action
 *         schema: { type: string }
 *       - in: query
 *         name: entity_type
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
 */
