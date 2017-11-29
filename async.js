'use strict';

exports.isStar = true;
exports.runParallel = runParallel;

function runParallel(jobs, parallelNum, timeout = 1000) {
    return new Promise(resolve => {
        var result = [];
        var next = 0;
        if (jobs.length <= 0) {
            resolve(result);
        }

        var indexedJobs = jobs.map((job, index) => ({ job, index }));
        indexedJobs.slice(0, parallelNum).map(startJob);

        function startJob(task) {
            next++;
            var dealer = res => end(res, task);
            new Promise((resolver, rejecter) => {
                task.job().then(resolver)
                    .catch(rejecter);
                setTimeout(rejecter, timeout, new Error('Promise timeout'));
            }).then(dealer)
                .catch(dealer);
        }

        function end(res, task) {
            result[task.index] = res;
            if (result.length === indexedJobs.length) {
                resolve(result);
            }

            if (next < indexedJobs.length) {
                startJob(indexedJobs[next]);
            }
        }
    });
}
