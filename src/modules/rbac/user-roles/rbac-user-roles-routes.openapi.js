/**
 * OpenAPI fragments for `rbac-user-roles.routes.js`.
 */

/**
 * @openapi
 * /rbac/users/{userId}/roles:
 *   get:
 *     tags: [RBAC — User roles]
 *     summary: List roles for user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 *   post:
 *     tags: [RBAC — User roles]
 *     summary: Assign role
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       201:
 *         description: Created
 *   put:
 *     tags: [RBAC — User roles]
 *     summary: Replace all roles for user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: User not found
 */

/**
 * @openapi
 * /rbac/users/{userId}/roles/{roleId}:
 *   delete:
 *     tags: [RBAC — User roles]
 *     summary: Remove role from user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: No content
 */
