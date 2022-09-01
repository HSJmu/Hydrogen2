// 라이브러리 및 컴포넌트 불러오기
// DeckGL 라이브러리를 이용한 지도 시각화
import React, { useState, useEffect } from 'react';
import { StaticMap } from 'react-map-gl';
import { AmbientLight, PointLight, LightingEffect } from '@deck.gl/core';
import DeckGL from '@deck.gl/react';
import { IconLayer } from '@deck.gl/layers';
import { TripsLayer } from '@deck.gl/geo-layers';
import Slider from '@mui/material/Slider';
import '../css/trip.css'

// 맵 토큰 값
const MAPBOX_TOKEN = `pk.eyJ1Ijoic3BlYXI1MzA2IiwiYSI6ImNremN5Z2FrOTI0ZGgycm45Mzh3dDV6OWQifQ.kXGWHPRjnVAEHgVgLzXn2g`; // eslint-disable-line

// 전역 빛 효과 추가
const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
});

// 특정 지점 빛 효과 추가
const pointLight = new PointLight({
  color: [255, 255, 255],
  intensity: 2.0,
  position: [-74.05, 40.7, 8000],
});

// deckgl 라이브러리에 빛 효과를 사용하기 위해 객체 생성
const lightingEffect = new LightingEffect({ ambientLight, pointLight });

// 테마 구성을 위한 설정
const material = {
  ambient: 0.1,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [60, 64, 70],
};

// 기본 테마값 설정
const DEFAULT_THEME = {
  buildingColor: [74, 80, 87],
  trailColor0: [253, 128, 93],
  trailColor1: [23, 184, 190],
  material,
  effects: [lightingEffect],
};

// 시뮬레이션 초기 상태
const INITIAL_VIEW_STATE = {
  longitude: 127.4,
  latitude: 36.35,
  zoom: 11,
  minZoom: 5,
  maxZoom: 16,
  pitch: 10,
  bearing: 0,
};

// 수소 충전소 위치를 표시하기 위한 마커
const ICON_MAPPING = {
  marker: {x: 0, y: 0, width: 128, height: 128, mask: true}
};

// 애니메이션을 이용해 시뮬레이션 진행
function renderLayers(props) {
  const time = props.time; // 시뮬레이션 진행 시간
  const trip = props.trip; // 차량 경로
  const loc = props.loc; // 수소 충전소 위치

  return [
    // 차량 경로를 나타내기 위한 trip 레이어
    new TripsLayer({
      id: 'trips',
      data: trip,
      getPath: (d) => d.route,
      getTimestamps: (d) => d.timestamp,
      getColor: (d) => DEFAULT_THEME.trailColor0,
      opacity: 0.3,
      widthMinPixels: 5,
      lineJointRounded: false,
      trailLength: 1.5,
      currentTime: time,
      shadowEnabled: false,
    }),
    // 수소 충전소를 나타내기 위한 마커 레이어
    new IconLayer({
      id: 'icon-layer',
      data: loc,
      sizeScale: 20,
      iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
      iconMapping: ICON_MAPPING,
      getIcon: (d) => 'marker',
      getSize: d => 1,
      getPosition: (d) => [d.loc[0], d.loc[1]],
      getColor: d => 
        (d.id === 'station_7') || (d.id === 'station_8') ? [255, 0, 0] : [255, 255, 0],
      opacity: 0.9,
      pickable: false,
      radiusMinPixels: 3,
      radiusMaxPixels: 5,
    }),
  ];
}

export default function Trip(props) {
  const minTime = props.minTime; // 시뮬레이션 최소 시간
  const maxTime = props.maxTime; // 시뮬레이션 최대 시간

  const animationSpeed = 2; // 시뮬레이션 진행 속도
  const time = props.time; // 시뮬레이션 진행 시간
  
  const trip = props.trip; // 시뮬레이션을 위한 차량 경로
  const loc = props.loc; // 시뮬레이션을 위한 수소 충전소 위치

  const [animationFrame, setAnimationFrame] = useState(''); // 애니메이션 프레임 생성
  const viewState = undefined;
  const mapStyle = 'mapbox://styles/spear5306/ckzcz5m8w002814o2coz02sjc'; // DeckGL 맵 스타일

  // 시뮬레이션 진행을 함수
  function animate() {
    props.setTime(time => {
      if (time > maxTime) {
        return minTime
      } else {
        return time + (0.01) * animationSpeed
      }
    })
    const af = window.requestAnimationFrame(animate);
    setAnimationFrame(af)
  }

  // 시뮬레이션 실행
  useEffect(() => {
    animate()
    return () => window.cancelAnimationFrame(animationFrame);
  }, [])

  // 슬라이더를 통한 시뮬레이션 진행 시간 조정
  function SliderChange(value) {
    props.setTime(value.target.value)
  }

  return (
    <div className="trip-container" style={{position:'relative'}}>
      {/* 시뮬레이션 지도 시각화 */}
      <DeckGL
        layers={renderLayers({'trip':trip, 'loc':loc, 'time':time})}
        effects={DEFAULT_THEME.effects}
        viewState={viewState}
        controller={true}
        initialViewState={INITIAL_VIEW_STATE}
      >
        <StaticMap
          mapStyle={mapStyle}
          preventStyleDiffing={true}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        />
      </DeckGL>
      {/* 진행 시간 출력 */}
      <h1 className="time">
        TIME : {(String(parseInt(Math.round(time) / 60) % 24).length === 2) ? parseInt(Math.round(time) / 60) % 24 : '0'+String(parseInt(Math.round(time) / 60) % 24)} : {(String(Math.round(time) % 60).length === 2) ? Math.round(time) % 60 : '0'+String(Math.round(time) % 60)}
      </h1>
      {/* 슬라이더 표시 */}
      <Slider id="slider" value={time} min={minTime} max={maxTime} onChange={SliderChange} track="inverted"/>
    </div>
  );
}