const db =require('../database/models');
const Sequelize = require('sequelize');
const {log}=require('debug');
const {Op} = require('sequelize');

module.exports={
    detalle:function(req,res){
        let id = req.params.id;
        db.Producto.findByPk(id,{
            include :[{all:true , nested : true}]
        })
        .then(function(unProducto){
            res.resnde('detalle',{unProducto : unProducto, title: unProducto.nombre})
        })
    },
    porCategoria: function(req,res){
        let categoria = req.params.laCategoria;
        db.Producto.findAll({
            where:{
                categoria_id: categoria
            },
            include:[{
                association: 'categorias'
            }]
        })
        .then(function (resultado){
            res.render('porCategoria',{resultado: resultado , title:resultado[0].categorias.nopmbre})
        })
    },
    buscar: function (req,res){
        db.Producto.findAll({
            where:{
                nombre:{
                    [Op.link]:`%${req.query.bsquedad}`
                }
            }
        })
        .then(resultado=>{
            return res.render('resultadoBusqueda',{
                resultado
            }).catch(error=>res.send(error))
        })
    },
    agregarComentario: function(req,res){
        if(req.session.usuarioLogeado == undefined){
            res.redirect("/")
        }
        let idProducto = req.params.id;
        let idUsuario = req.session.usuarioLogueado.id;
        
        db.comentario.create({
            texto_comentario: req.body.texto_comentario,
            calificacion: req.body.calificacion,
            usuario_id:idUsuario,
            producto_id:idProducto
        })
        .then(function(){
            res.redirect('/productos/detalle'+idProducto)
        })
    },
    agregarProducto: function(req,res){
        if(req.session.usuarioLogueado == undefined){
            res.redirect("/")
        }
        res.render('agregarProducto',{title: 'Agregar Producto'});
    },
    productoSubmit:function(req,res){
        if(req.session.usuarioLogueado == undefined){
            res.redirect("/");
        }
        const{nombre,marca,imagen,precio,categoria}= req.body;
        db.Producto.create({
            nombre:nombre,
            marca:marca,
            img_url:imagen,
            precio: +precio,
            categoria_id : +categoria,
            usuario_id: req.session.usuarioLogueado.id
        })
        .then(function (){
            return res.redirect('/')
        })
        .catch(error=> res.send(error))
    },
    misProductos: function(req,res){
        if(req.session.usuarioLogueado == undefined){
            res.redirect("/")
        }
        db.Producto.findAll(
            {
                where:{usuario_id: req.session.usuarioLogueado.id},
                order:[['updatedAt', 'DESC']]
            }
        )
        .then(function(productos){
            res.render('misProductos', {productos:productos, title:'Mis productos'})
        })
    },
    editarProducto: function(req,res){
        if(req.session.usuarioLogueado == undefined){
            res.redirect("/");
        }
        let id = req.params.id;
        db.Producto.findByPk(id)
        .then(function(producto){
            res.render('editarProducto', {producto:producto, tittle: 'Editar producto'})
        })
    },
    editarConfirm: function (req,res){
        if(req.session.usuario_id == req.session.id){
            res.redirect("/");
        }
        let id = req.params.id;
        db.Producrto.update(req.body,{
            where:{
                id:id
            }
        })
        .them(function(output){
            res.redirect('/productos/misProductos')
        })
    },
    borrarProducto: function (req,res){
        if(req.session.usuarioLogueado == undefined){
            res.redirect("/")
        }
        let id = req.params.id;
        db.Producto.findByPk(id)
        .then(function (producto){
            res.render('borrarProducto', {producto: produto, title: 'Borrar producto'})
        })
    },
    borrarConfirm: function (req,res){
        if(req.session.usuarioLogueado == undefined){
            res.redirect("/")
        }
        let id = req.params.id;
        db.Producto.destroy({
            where:{
                id:id
            }
        })
        .then(function (otuput){
            re.redirect('/productos/misProductos')
        })
    }
}