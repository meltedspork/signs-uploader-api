'use strict';

const { User, Sign } = require('../../models');
const { faker } = require('@faker-js/faker');
const sample = require('lodash/sample');

const SIGN_STATES = [
  'published',
  'created',
  'published',
  'drafted',
  'published',
];

module.exports = {
  up: async (queryInterface) => {
    console.log('starting seeding Signs...');
    const foundUsers = await User.findAll({
      order: ['createdAt'],
      limit: 1,
    });
    console.log('foundUsers:', foundUsers);
    const userId = foundUsers[0].id;
    console.log('userId:', userId);

    const nowDate = new Date();
    const nowDateToString = nowDate.toString();
    console.log('nowDateToString:', nowDateToString);

    let fakeSigns = [];

    for(let idx = 0; idx < 1; idx++) {
      const createdAt = faker.date.recent(10);
      console.log('createdAt:', createdAt);
      const updatedAt = faker.date.between(createdAt, nowDateToString);
      console.log('updatedAt:', updatedAt);

      const fakeSign = {
        uid: faker.datatype.uuid(),
        name: faker.word.noun(),
        pronounce: faker.word.adverb(),
        definition: faker.lorem.paragraph(),
        user_id: userId,
        state: sample(SIGN_STATES),
        created_at: new Date(createdAt),
        updated_at: new Date(updatedAt),
      }
      console.log(`fakeSign #${idx}:`, fakeSign);
      fakeSigns.push(fakeSign);
    }
    await queryInterface.bulkInsert('Signs', fakeSigns);
  },
  down: async () => {
    await Sign.destroy({ truncate: true });
  }
};
