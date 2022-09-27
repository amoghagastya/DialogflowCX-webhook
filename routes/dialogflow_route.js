const express = require('express');
const router = express.Router();

const CONTROLLER = require('../controllers/export_controller');

router.post('/dialogflow', async (req, res) => {

    let tag = req.body.fulfillmentInfo.tag;

    console.log('A new request is here');
    console.log(tag);

    if (tag === 'wellness_score') {
        let responseData = CONTROLLER.Response.handleWellness(req); 
        res.send(responseData);
    }
    if (tag === 'feelings') {
        let responseData = CONTROLLER.Response.handleFeelings(req); 
        res.send(responseData);
    }
    if (tag === 'disorder_answer') {
        let responseData = CONTROLLER.Response.disorder(req); 
        res.send(responseData);
    }
    if (tag === 'wellness_answer') {
        let responseData = CONTROLLER.Response.handleWellnessAns(req); 
        res.send(responseData);
    }
    if (tag === 'log') {
        let responseData = CONTROLLER.Response.handleLog(req); 
        res.send(responseData);
    }
    // else {
    //     res.send(
    //         CONTROLLER.util.formatResponse(
    //             [
    //                 'This is from the webhook.',
    //                 'There is no tag set for this request.'
    //             ]
    //         )
    //     );
    // }
});

module.exports = {
    router
};