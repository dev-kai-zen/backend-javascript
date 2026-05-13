/**
 * OpenAPI fragments for `rbac-permissions.routes.js`.
 */

/**
 * @openapi
 * /rbac/permissions:
 *   get:
 *     tags: [RBAC — Permissions]
 *     summary: List permissions
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 *   post:
 *     tags: [RBAC — Permissions]
 *     summary: Create permission
 *     responses:
 *       201:
 *         description: Created
 */

/**
 * @openapi
 * /rbac/permissions/{id}:
 *   get:
 *     tags: [RBAC — Permissions]
 *     summary: Get permission
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 *   patch:
 *     tags: [RBAC — Permissions]
 *     summary: Update permission
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 *   delete:
 *     tags: [RBAC — Permissions]
 *     summary: Soft-delete permission
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: No content
 */
