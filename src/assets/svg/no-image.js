import React from 'react';
import Svg, {Path, G, Circle} from 'react-native-svg';

function NoImage(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 500 500"
      {...props}>
      <Path
        d="M416.7 433.8s-95.9-313-86.6-313c15.2 0 49.6 2.7 49.6 2.7"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#B2DFDB"
      />
      <G clipRule="evenodd">
        <Path
          d="M381.1 120.7H327c-6.4-44.7-44.5-79.1-90.9-79.1-46.4 0-84.5 34.4-91 79.1h-54L51.6 437.1h369.1l-39.6-316.4zM236.1 68c31.9 0 58.2 22.7 64.3 52.7H171.8c6.2-30 32.5-52.7 64.3-52.7z"
          fill="none"
          stroke="#A0A0A0"
          strokeWidth={6.496}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
        />
        <Path
          d="M196.6 225.7c0 10.9-8.9 19.8-19.8 19.8s-19.8-8.8-19.8-19.8c0-10.9 8.9-19.8 19.8-19.8s19.8 8.9 19.8 19.8zm118.6 0c0 10.9-8.9 19.8-19.8 19.8s-19.8-8.8-19.8-19.8c0-10.9 8.8-19.8 19.8-19.8 10.9 0 19.8 8.9 19.8 19.8z"
          fillRule="evenodd"
          fill="#A0A0A0"
        />
      </G>
      <Path
        d="M319 355.2c-15-30.6-47-50.2-82.7-50.2-36.4 0-68.6 19.6-83.2 50.3-2.5-3.1-3.4-7.4-1.7-11.3 13.7-32.9 47-54.1 84.9-54.1 37.1 0 70.2 21.1 84.4 53.8 1.7 4 .9 8.4-1.7 11.5z"
        fill="#A0A0A0"
      />
      <Path
        d="M436.5 204.1c5.3.5 11.8 2.1 16.6 4.3 2.7 1.3 9.1 4.4 9.4 8 .4 5.6-14.1 4.7-18.4 5.4-.4 4.4 14.1 9.1 17.1 10.3 4.1 1.7 10 3.4 12.7 7.2"
        fill="none"
        stroke="#A0A0A0"
        strokeWidth={3.583}
        strokeMiterlimit={10}
      />
      <Circle
        cx={45}
        cy={245.5}
        r={12.5}
        fill="none"
        stroke="#A0A0A0"
        strokeWidth={3.248}
        strokeMiterlimit={10}
      />
      <Circle
        cx={432}
        cy={333.5}
        r={9}
        fill="none"
        stroke="#A0A0A0"
        strokeWidth={4.872}
        strokeMiterlimit={10}
      />
      <Path
        fill="#A0A0A0"
        d="M440.9 163.7l-3.6-3.6-7.2 7.2-7.1-7.2-3.6 3.6 7.1 7.2-7.1 7.1 3.6 3.6 7.1-7.1 7.2 7.1 3.6-3.6-7.1-7.1M32.4 261.3l-1.4-1.5-2.9 2.9-2.8-2.9-1.5 1.5 2.9 2.8-2.9 2.9 1.5 1.4 2.8-2.9 2.9 2.9 1.4-1.4-2.8-2.9"
      />
      <Path
        fill="#FFF"
        stroke="#A4A4A4"
        strokeWidth={2.765}
        strokeLinecap="square"
        strokeLinejoin="bevel"
        strokeMiterlimit={10}
        d="M59.4 461.9l-7.3-24.3-25-4.3 24.3-7.3 4.3-24.9 7.2 24.2 25 4.3-24.3 7.3z"
      />
    </Svg>
  );
}

export default NoImage;
