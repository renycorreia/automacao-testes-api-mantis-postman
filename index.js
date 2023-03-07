const path = require('path')
const async = require('async')
const newman = require('newman')

const PARALLEL_RUN_COUNT = 2

const parametersForTestRun = {
    collection: path.join(__dirname, 'postman/desafio-automacao-api.postman_collection.json'),
    environment: path.join(__dirname, 'postman/desafio-automacao-api-hml.postman_environment.json'),
    iterationData: path.join(__dirname, 'files/users.csv'),
    reporters: ['cli', 'htmlextra'],
    reporter:{
        htmlextra: {
            export: './results/index.html'
        }
    }
};

parallelCollectionRun = function (done) {
    newman.run(parametersForTestRun, done);
};

let commands = []
for (let index = 0; index < PARALLEL_RUN_COUNT; index++) {
    commands.push(parallelCollectionRun);
}

async.parallel(
    commands,
    (err, results) => {
        err && console.error(err);

        results.forEach(function (result) {
            var failures = result.run.failures;
            console.info(failures.length ? JSON.stringify(failures.failures, null, 2) :
                `${result.collection.name} ran successfully.`);
        });
    }
);