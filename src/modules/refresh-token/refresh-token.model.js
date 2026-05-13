import { DataTypes, Model } from "sequelize";

import { sequelize } from "../../config/sequelize-config.js";
import { User } from "../users/users.model.js";

export class RefreshToken extends Model {}

RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    token: {
      type: DataTypes.STRING(512),
      allowNull: false,
      unique: true,
    },
    expires_at: {
      type: DataTypes.DATE(3),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "refresh_tokens",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    paranoid: true,
    indexes: [{ fields: ["user_id"] }],
  },
);

RefreshToken.belongsTo(User, { foreignKey: "user_id", as: "user" });
