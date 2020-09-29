const Pepper = require('../models/Pepper');
const fs = require('fs');

exports.createPepper = (req, res) => {
    const pepperObject = JSON.parse(req.body.sauce);
    delete pepperObject._id;
    const object = new Pepper({
        ...pepperObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    });
    object.save()
        .then(() => res.status(201).json({message: 'Piment ajouté !'}))
        .catch((error) => {
            res.status(400).json({error});
        })
};

exports.updatePepper = (req, res) => {
    const pepperObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body};
    Pepper.updateOne({_id: req.params.id}, {...pepperObject, _id: req.params.id})
        .then(() => res.status(200).json({message: 'Piment modifié'}))
        .catch(error => res.status(400).json({error}));
};

exports.deletePepper = (req, res) => {
    Pepper.findOne({_id: req.params.id})
        .then(pepper => {
            const filename = pepper.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Pepper.deleteOne({_id: req.params.id})
                    .then(res.status(200).json({message: 'Piment supprimé avec succès !'}))
                    .catch(error => res.status(400).json({error}))
            });
        })
        .catch(error => res.status(500).json({error}));
};

exports.getAllPeppers = (req, res) => {
    Pepper.find()
        .then(peppers => res.status(200).json(peppers))
        .catch(error => res.status(400).json({error}));
};

exports.getOnePepper = (req, res) => {
    Pepper.findOne({_id: req.params.id})
        .then(pepper => res.status(200).json(pepper))
        .catch(error => res.status(400).json({error}));
};

exports.ratingOnePepper = async function (req, res) {
    Pepper.findOne({_id: req.params.id})
        .then((pepper) => {
            if (req.body.like === 0) {
                if (pepper.usersDisliked.includes(req.body.userId)) {
                    pepper.usersDisliked = pepper.usersDisliked.filter(element => element !== req.body.userId);
                } else if (pepper.usersLiked.includes(req.body.userId)) {
                    pepper.usersLiked = pepper.usersLiked.filter(element => element !== req.body.userId);
                }
            } else if (req.body.like === 1) {
                if (!pepper.usersLiked.includes(req.body.userId)) {
                    pepper.usersLiked.push(req.body.userId);
                }
                pepper.likes++;
            } else if (req.body.like === -1) {
                if (!pepper.usersDisliked.includes(req.body.userId)) {
                    pepper.usersDisliked.push(req.body.userId);
                }
                pepper.dislikes++;
            }
            Pepper.updateOne({_id: req.params.id} , {...pepper, _id: req.params.id})
                .then(() => {
                    res.status(200).json({message: "Vote pris en compte"})
                })
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => console.error(error));

}

