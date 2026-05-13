import { DataTypes, Model } from "sequelize";

import { sequelize } from "../../../config/sequelize-config.js";

export class RbacRole extends Model {}

RbacRole.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    role_description: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "rbac_roles",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    paranoid: true,
  },
);
