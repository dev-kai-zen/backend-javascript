/**
 * OpenAPI fragments for `rbac-categories.routes.js`.
 * Servers `url` is `/api/v1`; paths below are `/rbac/categories/...`.
 */

/**
 * @openapi
 * /rbac/categories:
 *   get:
 *     tags: [RBAC — Categories]
 *     summary: List categories
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Server error
 *   post:
 *     tags: [RBAC — Categories]
 *     summary: Create category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [categoryName]
 *             properties:
 *               categoryName: { type: string }
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation error
 *       409:
 *         description: Duplicate name
 */

/**
 * @openapi
 * /rbac/categories/{id}:
 *   get:
 *     tags: [RBAC — Categories]
 *     summary: Get category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 *   patch:
 *     tags: [RBAC — Categories]
 *     summary: Update category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryName: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *       409:
 *         description: Duplicate name
 *   delete:
 *     tags: [RBAC — Categories]
 *     summary: Soft-delete category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         description: Not found
 */
