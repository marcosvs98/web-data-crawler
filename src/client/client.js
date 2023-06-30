const axios = require('axios');

async function requestContent(url, headers, postdata) {
  try {
    const response = await axios.post(url, postdata, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  requestContent
};
