var express = require('express');
var router = express.Router();


router.get('/', (req, res)=>{
    res.render('signup.ejs', {errs: []});
});

module.exports = router;
