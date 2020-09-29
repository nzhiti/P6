const multer = require('multer');

const MIME_TYPES = {
    'image/jgp' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png'
}
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const extension = MIME_TYPES[file.mimetype];
        callback(null, file.fieldname + '-' + uniqueSuffix + '.' + extension);
    }
});

module.exports = multer({storage}).single('image');