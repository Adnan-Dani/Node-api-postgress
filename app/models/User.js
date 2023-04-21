module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        linkedinId: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: true

        },
        googleId: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: true

        }
    });
    return User;
}
