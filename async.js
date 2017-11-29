'use strict';

exports.isStar = false;
exports.runParallel = runParallel;

/** Функция паралелльно запускает указанное число промисов
 * @param {Array} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 */
function runParallel(jobs, parallelNum, timeout = 1000) {
    return new Promise(resolve => {
        var result = [];
        var next = 0;
        if(jobs.length <= 0){
            resolve(result);
        }

        var indexedJobs = jobs.map((job, index) => ({job, index}));
        indexedJobs.slice(0, parallelNum).map(startJob);

        function startJob(task){
            next++;
            var dealer = res => End(res, task)
            task.job().then(dealer).catch(dealer);
        }

        function End(res, task) {
            result[task.index] = res;
            if(result.length === indexedJobs.length){
                resolve(result);
            } 
            
            if(next < indexedJobs.length) {
                startJob(indexedJobs[next]);
            }
        }
    });
}
