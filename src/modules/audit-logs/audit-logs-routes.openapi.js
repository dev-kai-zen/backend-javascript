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
 *   post:
 *     tags: [Audit logs]
 *     summary: Create audit logs (bulk)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [logs]
 *             properties:
 *               logs:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required: [action, entity_type]
 *                   properties:
 *                     user_id: { type: integer, nullable: true }
 *                     action: { type: string }
 *                     entity_type: { type: string }
 *                     entity_id: { type: string, nullable: true }
 *                     old_values: { type: object, nullable: true }
 *                     new_values: { type: object, nullable: true }
 *                     change_fields:
 *                       type: array
 *                       items: { type: string }
 *                       nullable: true
 *                     ip_address: { type: string, nullable: true }
 *                     user_agent: { type: string, nullable: true }
 *                     timestamp: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
