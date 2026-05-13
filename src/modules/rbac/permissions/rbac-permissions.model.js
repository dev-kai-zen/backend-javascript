import { DataTypes, Model } from "sequelize";

import { sequelize } from "../../../config/sequelize-config.js";
import { RbacCategory } from "../categories/rbac-categories.model.js";

export class RbacPermission extends Model {}

RbacPermission.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    permission_code: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    permission_description: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: RbacCategory,
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "rbac_permissions",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    paranoid: true,
  },
);

RbacPermission.belongsTo(RbacCategory, {
  foreignKey: "category_id",
  as: "category",
});
