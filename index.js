const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();
app.use(bodyParser.json());
const PORT = 3000;

const cors = require('cors');
app.use(cors({
    origin: true
}));
app.use(fileUpload({
    limits: {
        fileSize: 50 * 1024 * 1024
    }
}));

app.get('/ping', (req, res) => {
    const obj = {
        app: 'traza-imagenes',
        author: 'GL | Jeffrey Espinel.',
        date: "18/12/2020"
    }
    res.json(obj);
});


app.get('/glapp/:gli/glu/:glu/glw/:w/img/:id', async (req, res) => {

    const params = req.params;
    let {
        glu: user,
        w: pw,
        gli: glappId
    } = params;

    const mongoClusterString = `@srv-trzv.xxszo.mongodb.net/glgallery`
    const conexion = `mongodb+srv://${user}:${pw}${mongoClusterString}`;

    const mongo = await mongoose.connect(conexion, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).then(() => {
        console.log('DB_OK!!')
        return true;
    }).catch((err) => {
        console.log('DB_error!!', err)
        res.send(401, {
            'msg': 'Falló la conexión a la galería de GLAPP.',
            err
        })
    });
    try {
        ModelImagen.findById(req.params.id).exec((err, doc) => {
            console.log('err', err)
            console.log('doc', doc)
            if (err) {
                res.json(500, {
                    err
                })
            }

            if (!doc) res.send(404, {
                'msg': `Resource [${req.params.id}] not found.`
            })

            res.set('Content-type', doc.content_type);
            res.send(doc.foto.data);

        })
    } catch (e) {
        res.json(500, {
            err: e
        })
    }

});




app.listen(PORT, () => {
    console.log("running server!!");
});
