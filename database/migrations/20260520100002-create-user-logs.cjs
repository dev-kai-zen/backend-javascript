"use strict";

/** @see src/modules/user-logs/user-logs.model.js */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "user_logs",
      {
        id: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: true,
          references: { model: "users", key: "id" },
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
        },
        action: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        module: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        method: {
          type: Sequelize.STRING(10),
          allowNull: true,
        },
        route: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        status_code: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        ip_address: {
          type: Sequelize.STRING(45),
          allowNull: true,
        },
        user_agent: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        device_type: {
          type: Sequelize.STRING(50),
          allowNull: true,
        },
        browser: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        os: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        session_id: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        metadata: {
          type: Sequelize.JSON,
          allowNull: true,
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
        indexes: [
          { name: "idx_user_id", fields: ["user_id"] },
          { name: "idx_action", fields: ["action"] },
          { name: "idx_created_at", fields: ["created_at"] },
        ],
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("user_logs");
  },
};
