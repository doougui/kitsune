module.exports = (sequelize, DataTypes) => {
  return sequelize.define('servers', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    name: DataTypes.STRING,
    welcome_channel: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: true
    },
    suggestions_channel: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: true
    }
  }, {
    timestamps: false
  });
};
