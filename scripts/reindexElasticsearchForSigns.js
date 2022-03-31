const { Sign } = require('../models');
const { updateSignDocument } = require('../services/elasticsearch-index-sign');

(async () => {
  try {
    const signs = await Sign.findAll({
      attributes: [
        'id',
      ],
    });
    console.log('signs', signs);
    signs.forEach(({ id }) => updateSignDocument({ id }));
  } catch (error) {
    console.log('error', error);
  }
})();
