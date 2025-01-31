import http from 'k6/http';
import { sleep, check } from 'k6';



export default function () {

  const host = 'http://127.0.0.1:8000/'


  // первый запрос. Условно авторизация
  const params = {
    headers: {
      'Content-Type': 'text/html'
    }
  };

  let res = http.get(host, params);

  let is_checking = check(res, {
    'is status 200': (r) => r.status === 200,
  });

  if(is_checking) {
    const token = JSON.parse(res.body).token;
    
    sleep(1);



    // второй запрос, пост
    let dynamic_data = {data: 'Этот абстрактный json ни на что не влияет'}
    let json = JSON.stringify(dynamic_data);

    // let dynamic_data = 'Этот абстрактный json ни на что не влияет'
    // let json = JSON.stringify({
    //   data: dynamic_data,
    // });

    params.headers['Content-Type'] = 'application/json'
    params.headers.Authorization = token

    let res_post = http.post(host + 'any_endpoint', json, params)
    check(res_post, {
      'is status 200': (r) => r.status === 200,
    });


    //только для 6 пункта тз
    console.log("data : " + JSON.parse(res_post.body).data)
  }
}
