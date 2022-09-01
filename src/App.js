// 라이브러리 및 컴포넌트 불러오기
import './css/App.css';
import Main from './component/Main';
import Splash from './component/Splash';
import { useEffect, useState } from 'react';

// 비동기 http 클라이언트 -> axios 라이브러리
const axios = require('axios');

// axios 라이브러리를 이용해 데이터 가져오기
function getData(type){
  const url = `/data/${type}.json`
  const response = axios.get(url);
  return response.then(res => res.data)
}

export default function App() {
  // 시나리오3과 시나리오4에 필요한 데이터를 받아올 변수 선언
  const [load, setLoad] = useState(false);
  const [trip1, setTrip1] = useState([]);
  const [loc1, setLoc1] = useState([]);
  const [trip2, setTrip2] = useState([]);
  const [loc2, setLoc2] = useState([]);
  
  // 페이지가 처음 로딩될 때 시뮬레이션에 필요한 데이터 받아오기
  useEffect(() => {
    async function getFetchData() {
      // 시나리오3 - 차량 이동 경로, 수소 충전소 위치 데이터
      const trip1 = await getData('hydrogen_car_trips_scen_3')
      const loc1 = await getData('station_location_scen_3')

      // 시나리오4 - 차량 이동 경로, 수소 충전소 위치 데이터
      const trip2 = await getData('hydrogen_car_trips_scen_4')
      const loc2 = await getData('station_location_scen_4')

      // 위에서 받아오는 데이터가 참 값일 때 변수에 저장
      if ((trip1 && loc1) && (trip2 && loc2)) {
        setTrip1(trip1);
        setLoc1(loc1);
        setTrip2(trip2);
        setLoc2(loc2);
        setLoad(true);
      };
    };

    // 위에 데이터 받아오는 함수 실행
    getFetchData()
  }, [])
  
  // 시뮬레이션에 필요한 데이터를 모두 받아오면
  // 하위 컴포넌트로 데이터 전달
  return (
    <div className='App'>
      {load ? <Main trip1={trip1} trip2={trip2} loc1={loc1} loc2={loc2}/> : <Splash/>}
    </div>
  );
}