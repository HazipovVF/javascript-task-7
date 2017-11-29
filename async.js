'use strict';

exports.isStar = true;
exports.runParallel = runParallel;

/** Функция паралелльно запускает указанное число промисов
 * @param {Array} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 */
function runParallel(jobs, parallelNum, timeout = 1000) {
    return new Promise(resolve => {
        var result = [];
        var completedJob = 0;
        if(jobs.length <= 0){
            resolve(result);
        }

        var indexedJobs = jobs.map((job, index) => {return {job, index};});
        indexedJobs.map(startJob).slice(0, parallelNum);

        function startJob(task){
            var dealer = res => End(res, task)
            task.job().then(dealer).catch(dealer);
        }

        function End(res, task) {
            ++completedJob;
            result[task.index] = res;
            if(completedJob === indexedJobs.length){
                resolve(result);
            } 
        }
    });
}
