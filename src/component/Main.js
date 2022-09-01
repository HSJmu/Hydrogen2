// 라이브러리 및 컴포넌트 불러오기
import { useState } from 'react';
import Trip from './Trip';
import '../css/main.css';

export default function Main(props){
    const minTime = 300; // 시뮬레이션 시작 시간
    const maxTime = 1440; // 시뮬레이션 종료 시간
    const [time1, setTime1] = useState(minTime); // 시나리오3의 진행 시간
    const [time2, setTime2] = useState(minTime); // 시나리오4의 진행 시간

    const trip1 = props.trip1; // 부모 컴포넌트에서 받아온 시나리오1의 차량 경로 데이터
    const loc1 = props.loc1; // 부모 컴포넌트에서 받아온 시나리오1의 수소 충전소 위치 데이터

    const trip2 = props.trip2; // 부모 컴포넌트에서 받아온 시나리오2의 차량 경로 데이터
    const loc2 = props.loc2; // 부모 컴포넌트에서 받아온 시나리오2의 수소 충전소 위치 데이터

    // 위에서 선언한
    // 시뮬레이션 시작 시간, 시뮬레이션 종료 시간,
    // 각 시나리오의 진행 시간, 각 시나리오의 차량 경로와 수소 충전소 위치 데이터를
    // 각각의 시뮬레이션에 전달
    return(
        <div className="container">
            <Trip className="trip1" trip={trip1} loc={loc1} minTime={minTime} maxTime={maxTime} time={time1} setTime={setTime1}></Trip>
            <div className='v-line'></div>
            <Trip className="trip2" trip={trip2} loc={loc2} minTime={minTime} maxTime={maxTime} time={time2} setTime={setTime2}></Trip>
        </div>
    )
}