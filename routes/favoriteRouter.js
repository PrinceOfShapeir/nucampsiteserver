const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');
const campsiteRouter = require('./campsiteRouter');
const { populate } = require('../models/favorite');

const favoriteRouter = express.Router();

/* Route template
.options(cors.corsWithOptions, (req,res)=>res.sendStatus(200))
.get(cors.cors, (req,res, next)=>{

})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res, next)=>{

})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res, next)=>{

})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res, next)=>{

});

*/
/*
function toPrimitive (input){

    let output = "";
    for(let z = 0; z< input.length; z++){
        output = output.concat(input[z].charCodeAt(0).toString(2))
    }

    return output;
}*/

function uniqueMerge (input, old){

    let tempArray = JSON.parse(JSON.stringify(old));
    console.log("temparray:", tempArray);
    let initLength = tempArray.length;
    let changed = false;
        for(let i in input){
            if(input[i]!==undefined) tempArray.push(input[i]._id);
        }
    let tempSet = new Set(tempArray);
    //tempSet.delete(undefined);
    console.log(tempSet);
    if(tempSet.size!==initLength) {
        changed = true;
    }

    if(changed){
        return tempSet;
    } else return changed;

}

function composeCampsitesArrayWithIds (inputSet){

    if(!inputSet) return false;
    let tempArray = Array.from(inputSet);
    let outputArray = [];
    for(let i in tempArray){
        if(tempArray[i]!==undefined) outputArray.push({"_id":`${tempArray[i]}`});
    }


    return outputArray;
}

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req,res)=>res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req,res, next)=>{

    Favorite.find({user: req.user._id})
    .populate('user')
    .populate('campsites')
    .then(favorites=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        //console.log(favorites[0].campsites[0]);
        res.json(favorites);
    }).catch(err => next(err));

})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res, next)=>{
    Favorite.findOne({user: req.user._id})
    .then(favorites=>{
        if(favorites&&favorites.campsites){

            /* mongoose must be inserting special characters or formatting somewhere, which threw off the ES6 Set generator
            let testArray = JSON.parse(JSON.stringify(favorites.campsites));
            console.log("testarray:", testArray);
            for(let i in req.body){
                testArray.push(req.body[i]._id);
            }
            console.log("testarray with new body:", testArray);

            let testSet = new Set(testArray);
            testArray = Array.from(testSet);
            console.log(testArray);*/

            /*
            let testSet = new Set();
            testSet.add(toPrimitive(favorites.campsites[0]).toString());
            console.log('Testset has 5fd502dd66ba38b388c529b2', testSet.has(toPrimitive("5fd502dd66ba38b388c529b2")), "it instead contains", testSet.values().next().value);
*/

            //there's probably a better unique merge algo but I'll just use a basic temp array


           
            //console.log(Array.from(tempSet).toString());


            if(req.body){
                
                let favoritesChange = uniqueMerge(req.body, favorites.campsites);
                //uniquemerge returns a set or false
                if(favoritesChange) {

                    //favorites.campsites = composeCampsitesArrayWithIds(favoritesChange);
                    favorites.campsites = composeCampsitesArrayWithIds(favoritesChange);
                    console.log('favoritesChange:', favoritesChange, 'becomes ', favorites.campsites);
                    
                    favorites.save()
                    .then(favorites=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    console.log("favorites changed");
                    res.json(favorites);
                }).catch(err=>next(err));

                }
                else  {
                    console.log('No new favorites to add', favorites);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                }
            }
              
        } else { //no campsites
            console.log("no favorites yet, attempting to post");
            let output = {
                "user":`${req.user._id}`,
                "campsites": []
        }
            for(let i in req.body){
                output.campsites.push({'_id':`${req.body[i]._id}`});
            }

            Favorite.create(output)
            .then(favorites => {
                console.log('Favorites Created ', favorites);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            })
            .catch(err => next(err));
            }
    }).catch(err=>next(err));

})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res, next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res, next)=>{
    Favorite.findOneAndDelete({user: req.user._id})
    .then(favorite=>{
        if(favorite){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('No Favorites to delete.');
        }
    }).catch(err => next(err));
});

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, authenticate.verifyUser, (req,res)=>res.sendStatus(200))
.get(cors.cors, (req,res, next)=>{
    res.statusCode = 403;
    res.end("GET operation not supported on /favorites/:campsiteId");
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res, next)=>{
    Favorite.findOne({user: req.user._id})
    .then(favorites=>{
        if(favorites&&favorites.campsites){
            if(!favorites.campsites.includes(req.params.campsiteId)){
                favorites.campsites.push({"_id":`${req.params.campsiteId}`})
                favorites.save()
                .then(favorites=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                }).catch(err=>next(err));
            }
        } else {
            Favorite.create({"campsites": [`${req.params.campsiteId}`], "user":`${req.user._id}`})
            .then(favorites => {
                console.log('Favorites Created ', favorites);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            })
            .catch(err => next(err));
        }
    }).catch(err=>next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res, next)=>{
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites/:campsiteId");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res, next)=>{
    Favorite.findOne({user: req.user._id})
    .then(favorites=>{
        if(favorites.campsites.length>0){
            let toDelete = favorites.campsites.indexOf();
            if(toDelete>=0){
                favorites.campsites.splice(toDelete, 1);
                favorites.save()
                .then(favorites=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                }).catch(err=>next(err));
            } else {
                //not found
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('No Favorites to delete.');
            }
        }
    }).catch(err=>next(err));
});

module.exports = favoriteRouter;