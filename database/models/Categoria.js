module.exports = (sequelize, DataTypes) => { 

    let alias = "Categoria";
    
    let cols = {
        id: {
            type : DataTypes.INTEGER.UNSIGNED,
            primaryKey : true,
            allowNull : true,
            autoIncrement :true 
        },
       nombre: {
            type : DataTypes.STRING(45),
            allowNull : true,
           
        },
    };

    let config = {
        tableName :'categorias',
        timestamps : false,
       
    };

    const Categoria = sequelize.define(alias,cols, config);
    
   

    return Categoria;
}