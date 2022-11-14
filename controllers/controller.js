const util = require('./util');
const axios = require('axios')

let bio_pred_1 = ''
let bio_pred_2 = ''

const handleSampleResponse = (req) => {

    console.log(req.body);

    return util.formatResponseForDialogflow(
        [
            'This is a sample response from webhook.',
            'Another sample response.'
        ],
        '',
        '',
        ''
    );
};

const disorder =  (req) => {
    console.log(req.body);
    let session = req.body.sessionInfo.session

    let ans = req.body.sessionInfo.parameters.disorder_ans

    let res = queryDisorder(ans).then((response) => {
        console.log(`res is ${response}`)
        bio_pred_1 = response[0]
        bio_pred_2 = response[1]
    })
    // return util.formatResponseForDialogflow(
        
    //    [],
    //     '',
    //     '',
    //     // target,
    //     ''
    // );

    // let target = 'projects/master-charmer-363509/locations/asia-south1/agents/39d70384-d6de-457d-9b3f-8807ca5054a6/flows/3e8c4dd9-51b8-445b-b50d-b624f673e9f4'

};



const handleLog = (req) => {
    
    console.log(req.body);
    let session = req.body.sessionInfo.session
    console.log(`last vals are ${bio_pred_1}, ${bio_pred_2}`)
    let target = 'projects/master-charmer-363509/locations/asia-south1/agents/39d70384-d6de-457d-9b3f-8807ca5054a6/flows/3e8c4dd9-51b8-445b-b50d-b624f673e9f4'
    let flag;
    if (bio_pred_1 == 'oral'){
        console.log('oh yea ')
        flag = true
}
if (flag == true) {
    return util.formatResponseForDialogflow(
        [
            'i really dont even know'
        ],
        '',
        '',
        '',
        ''
    );
}
};


const queryDisorder = async (ans) => {
    // console.log(req.body);
    // let session = req.body.sessionInfo.session
    // let ans = req.body.sessionInfo.parameters.disorder_ans;
    try {
        let bio_res = await query_bioenergy({"inputs": ans})
        let bio = JSON.stringify(bio_res[0])
        console.log(`bio res ${bio}`)
            let p1 = await bio_res[0][0]['label']
            let p2 = await bio_res[0][1]['label']
            console.log(`response ${p1} ${p2}`)
            return ([p1,p2])
    }
    catch(error)  {
        console.log(`error arisen ${error}`)
    }

}


async function query_sentiment(data) {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/",
      data,
      {
        headers: { Authorization: "Bearer ", 'content-type': 'text/json' }
      }
    );
    const result = await response.data;
    return result;
  }
  catch(error) {
    console.log(`error is ${error.response}, ${error.response.status}`)
    if (error.response.status == 503) {
        console.log('inside base func error retry')
        let result = query_sentiment({"inputs": feelings})
        return result
    }
  }
}

async function query_bioenergy(data) {
    // try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/l",
        data,
        {
          headers: { Authorization: "Bearer ", 'content-type': 'text/json' }
        }
      );
      const result = await response.data;
      return result;
    // }
//     catch(error) {
//       console.log(`error is ${error}, ${error.response.status}`)

//    }
}

async function query_disorder(data) {
    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/",
        data,
        {
          headers: { Authorization: "Bearer ", 'content-type': 'text/json' }
        }
      );
      const result = await response.data;
      return result;
    }
    catch(error) {
      console.log(`error is ${error.response}, ${error.response.status}`)
    }
}

async function query_fear(data) {
    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/Infiheal/fear_model",
        data,
        {
          headers: { Authorization: "Bearer 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", 'content-type': 'text/json' }
        }
      );
      const result = await response.data;
      return result;
    }
    catch(error) {
      console.log(`error is ${error}, ${error.response.status}`)
    }
}

async function query_trauma(data) {
    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/",
        data,
        {
          headers: { Authorization: "Bearer ", 'content-type': 'text/json' }
        }
      );
      const result = await response.data;
      return result;
    }
    catch(error) {
      console.log(`error is ${error}, ${error.response.status}`)
    }
}


const handleFeelings = async(req) => {
    console.log(req.body);
    let feelings = req.body.sessionInfo.parameters.feelings;
    console.log(`user said - ${feelings}`)

    try {
        let senti = query_sentiment({"inputs": feelings}).then((response) => {
            console.log('sentiment response ',JSON.stringify(response));
        });
        console.log(`sentiment ${senti}`)
   }
    catch(error) {
        console.log(`error is ${error}, ${error.response.status}`)
        // if (error.includes('503')) {
        //     console.log('inside error retry')
        //     let senti = query_sentiment({"inputs": feelings})
        // }
    }
    
    let bio = query_bioenergy({"inputs": feelings}).then((response) => {
        console.log('bioenergy response',JSON.stringify(response));
    });
    console.log(`bioenergy ${bio}`)
    
    let disorder = query_disorder({"inputs": feelings}).then((response) => {
        console.log('disorder response ', JSON.stringify(response));
    });
    console.log(`disorder ${disorder}`)
    
    // return util.formatResponseForDialogflow(
    //     [
    //         'This is a sample response from webhook.',
    //         'Another sample response.'
    //     ],
    //     '',
    //     '',
    //     ''
    // );
};

const handleDisorderAns = async (req) => {
    console.log(req.body);
    let ans = req.body.sessionInfo.parameters.disorder_ans;
    console.log(`disorder user said - ${ans}`)
    let session = req.body.sessionInfo.session
    console.log(`session ${session}`)

    try {
        let bio_res = await query_bioenergy({"inputs": ans})
        let bio = JSON.stringify(bio_res[0])
        console.log(`bio res ${bio}`)
            let p1 = JSON.stringify(bio_res[0][0]['label'])
            let p2 = JSON.stringify(bio_res[0][1]['label'])
            console.log(`response ${p1} ${p2}`)
            let params = {
                prediction : 'test'
            }
        return util.formatResponseForDialogflow(
            [
            'This is a sample response from webhook.'
            ],
            {
                session : session,
                parameters : params
            },
            '',
            ''
        );
   }
    catch(error) {
        console.log(`error is ${error}`)
        if (error.status == 503) {
            console.log('inside error retry')
            // let bio = await query_bioenergy({"inputs": ans})
            // console.log('bioenergy response ',JSON.stringify(bio.response));
            try {
                let bio = await query_bioenergy({"inputs": ans})
                console.log(`bioenergy ${bio}`) }
            catch(error) {
                console.log(`error ${error}`)
                }   
            }
        }
    }


const handleWellnessAns = async function handleWellnessAns(req) {
    console.log(req.body);
    let ans = req.body.sessionInfo.parameters.wellness_ans;
    console.log(`wellness user said - ${ans}`)
    let session = req.body.sessionInfo.session

    try {
        let bio = await query_bioenergy({"inputs": ans})
        console.log('bioenergy response ',JSON.stringify(bio.response));
        let res = await bio.response[0].slice(0,3)
        let bio_pred_1 = await res[0]
        let bio_pred_2 = await res[1]
        console.log(`bio preds ${bio_pred_1} ${bio_pred_2}`)
        let parameters = {
                bio_pred_1 : bio_pred_1,
                bio_pred_2 : bio_pred_2
            }
        return util.formatResponseForDialogflow(
            [],
            {
                session : session,
                parameters : parameters
            }
        );
   }
    catch(error) {
        console.log(`error is ${error.response}, ${error.response.status}`)
        if (error.response.status == 503) {
            console.log('inside error retry')
            let bio = await query_bioenergy({"inputs": ans})
            console.log('bioenergy response ',JSON.stringify(bio.response));
            let res = await bio.response[0].slice(0,3)
            let bio_pred_1 = res[0]
            let bio_pred_2 = res[1]
            console.log(`bio preds ${bio_pred_1} ${bio_pred_2}`)
            let parameters = {
                    prediction_1 : bio_pred_1
                }
            return util.formatResponseForDialogflow(
                    [],
                    {
                        session : session,
                        parameters : parameters
                    },
                    '',
                    ''
            );
            };
        }
    }

const handleWellness = (req) => {
    console.log(req.body);
    let session = req.body.sessionInfo.session
    console.log(`session ${session}`)

    let social = req.body.sessionInfo.parameters.rating_social
    let occupation = req.body.sessionInfo.parameters.rating_occupational
    let emotion = req.body.sessionInfo.parameters.rating_emotional
    let finance = req.body.sessionInfo.parameters.rating_financial
    let intellect = req.body.sessionInfo.parameters.rating_intellect
    let physical = req.body.sessionInfo.parameters.rating_physical
    let spiritual = req.body.sessionInfo.parameters.rating_spiritual

    let wellness = {
        'Social' : social,
        'Occupational' : occupation,
        'Emotional' : emotion,
        'Financial' : finance,
        'Intellectual' : intellect,
        'Physical' : physical,
        'Spiritual' : spiritual
    }
    var items = Object.keys(wellness).map(function(key) {
        return [key, wellness[key]];
      });
    let sorted_score = items.sort(function(first, second) {
        return second[1] - first[1];
    })
    let domain = sorted_score.slice(-1)[0][0]
    console.log(`domain ${domain} ${typeof(domain)}`)
    let parameters = {
        area : domain
    }
    return util.formatResponseForDialogflow(
        [],
        {
            session : session,
            parameters : parameters
        },
        '',
        ''
    );
};

module.exports = {
    handleSampleResponse,
    handleWellness,
    handleFeelings,
    handleDisorderAns,
    handleWellnessAns,
    // handleDisorder,
    handleLog,
    disorder
};
