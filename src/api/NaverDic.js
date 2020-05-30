dotenv.config();
import dotenv from 'dotenv';
import request from 'request';

const searchInDict = (name) => {
  const option = {
    query: name,
    start: 1,
    display: 1,
  };
  let json;
  request.get(
    {
      uri: 'https://openapi.naver.com/v1/search/encyc.json',
      qs: option,
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
      },
    },
    function (err, res, body) {
      json = JSON.parse(body);
    },
  );
  return json;
};

export default searchInDict;
