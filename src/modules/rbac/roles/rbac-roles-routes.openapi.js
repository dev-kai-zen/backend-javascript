/**
 * OpenAPI fragments for `rbac-roles.routes.js` and nested role-permissions routes.
 */

/**
 * @openapi
 * /rbac/roles:
 *   get:
 *     tags: [RBAC — Roles]
 *     summary: List roles
 *     responses:
 *       200:
 *         description: OK
 *   post:
 *     tags: [RBAC — Roles]
 *     summary: Create role
 *     responses:
 *       201:
 *         description: Created
 */

/**
 * @openapi
 * /rbac/roles/{id}/permissions:
 *   get:
 *     tags: [RBAC — Roles]
 *     summary: List permissions for role
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 *   put:
 *     tags: [RBAC — Roles]
 *     summary: Replace all permissions for role
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [permissionIds]
 *             properties:
 *               permissionIds:
 *                 type: array
 *                 items: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Role not found
 *   post:
 *     tags: [RBAC — Roles]
 *     summary: Link one permission to role
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       201:
 *         description: Created
 */

/**
 * @openapi
 * /rbac/roles/{id}/permissions/{permissionId}:
 *   delete:
 *     tags: [RBAC — Roles]
 *     summary: Unlink permission from role
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: permissionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: No content
 */

/**
 * @openapi
 * /rbac/roles/{id}:
 *   get:
 *     tags: [RBAC — Roles]
 *     summary: Get role
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 *   patch:
 *     tags: [RBAC — Roles]
 *     summary: Update role
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 *   delete:
 *     tags: [RBAC — Roles]
 *     summary: Soft-delete role
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: No content
 */
