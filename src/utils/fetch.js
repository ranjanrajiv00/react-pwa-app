import axios from 'axios';
import indexedDB from './indexedDb';

class ServiceUtils {
  fetch = async (url, action, options) => {
    let headers = {};
    let fetchUrl = `http://localhost:5000/${url}`;
    let response = {};
    let responseData;

    // Request options in axios format
    const reqOptions = {
      url: fetchUrl,
      headers,
      ...options,
    };

    try {
      if (navigator.onLine) {
        response = await axios(reqOptions);
        responseData = response.data;
      }
      else {
        const data = options ? options.data : {
          status: 200,
          message: 'OFFLINE'
        };
        if (options.method === 'GET')
          return data;

        const pendingAction = {
          action: action,
          data: data
        }

        indexedDB.openDatabase().then(() => {
          var timestamp = new Date().getUTCMilliseconds();
          indexedDB.add({ entityUrl: `${fetchUrl}/${timestamp}`, data: pendingAction });
        });

        responseData = data;
      }
    } catch (err) {
      responseData = {
        status: 500,
        error: err,
      };
    }

    return responseData;
  };
}

export default new ServiceUtils();
