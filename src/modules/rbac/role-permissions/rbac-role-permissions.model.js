import { DataTypes, Model } from "sequelize";

import { sequelize } from "../../../config/sequelize-config.js";
import { RbacPermission } from "../permissions/rbac-permissions.model.js";
import { RbacRole } from "../roles/rbac-roles.model.js";

export class RbacRolePermission extends Model {}

RbacRolePermission.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: RbacRole,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    permission_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: RbacPermission,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "rbac_role_permissions",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ["role_id", "permission_id"],
      },
    ],
  },
);

RbacRolePermission.belongsTo(RbacRole, { foreignKey: "role_id", as: "role" });
RbacRolePermission.belongsTo(RbacPermission, {
  foreignKey: "permission_id",
  as: "permission",
});

RbacPermission.hasMany(RbacRolePermission, {
  foreignKey: "permission_id",
  as: "role_permissions",
});
