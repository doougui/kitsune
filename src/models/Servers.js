module.exports = (sequelize, DataTypes) => {
  return sequelize.define('servers', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
    name: DataTypes.STRING,
    welcome_channel: {
      type: DataTypes.STRING,
      allowNull: true
    },
    suggestions_channel: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: false
  });
};
