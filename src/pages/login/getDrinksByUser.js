
function main({_usr}) {
  return new Promise(
    (resolve, reject) => {
    //send message to slack channel
    var http = require('http');
  if(!_usr) {
    _usr = 'guest';
  }
  http.get(`http://ec2-34-251-116-35.eu-west-1.compute.amazonaws.com/api/users/${_usr}/drinks?api_key=140bd66234dbe096f212e9753b4ff9c5`, function (response) {
    var body = '';
    response.on('data', function (d) {
      body += d;
    });
    response.on('end', function () {
      resolve({
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        body: new Buffer(body).toString('base64')
      })
    });
  }).on('error', function (err) {
    reject({
      statusCode: 500,
      body: {'error': err}
    })
  });
}
)
}
