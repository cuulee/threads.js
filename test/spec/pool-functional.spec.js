import expect   from 'expect.js';
import { Pool } from '../../lib/';

describe('Pool (functional test)', function () {
  this.timeout(10000)

  const pool = new Pool();
  const jobs = [], promises = [];

  const handler = (input, done) => {
    done(input);
  };

  it('can send data and run promisified', () => {
    pool.run(handler);

    for (let i = 0; i < 10; i++) {
      const job = pool.send(i);
      if (jobs.indexOf(job) > -1) {
        throw new Error('pool.send() returns the same job twice');
      }

      jobs.push(job);
      promises.push(job.promise());
    }

    return Promise.all(promises)
      .then(responses => {
        expect(responses.sort()).to.eql([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]);
      })
  });
});
