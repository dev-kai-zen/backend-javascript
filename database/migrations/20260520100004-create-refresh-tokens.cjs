"use strict";

/** @see src/modules/refresh-token/refresh-token.model.js */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "refresh_tokens",
      {
        id: {
          type: Sequelize.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: { model: "users", key: "id" },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        token: {
          type: Sequelize.STRING(512),
          allowNull: false,
          unique: true,
        },
        expires_at: {
          type: Sequelize.DATE(3),
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE(3),
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(3)"),
        },
        updated_at: {
          type: Sequelize.DATE(3),
          allowNull: false,
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)",
          ),
        },
        deleted_at: {
          type: Sequelize.DATE(3),
          allowNull: true,
        },
      },
      {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
        indexes: [{ fields: ["user_id"] }],
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("refresh_tokens");
  },
};
