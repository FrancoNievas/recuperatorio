module.exports = (sequelize, DataTypes) => {

    let cols = {
       id:{
           type:DataTypes.INTEGER(11),
           autoIncrement: true,
           primaryKey: true
       },
       nombre:{
           type:DataTypes.STRING(45)
       }
    };

    let config = {
       tableName:"categorias"
    };

    const Categoria = sequelize.define("Categoria", cols, config);

     Categoria.associate = function (models) {
        Categoria.hasMany(models.Producto, {
            as: 'products',
            foreignKey: 'categoria_id'
        })
    }
     return Categoria;
 }
