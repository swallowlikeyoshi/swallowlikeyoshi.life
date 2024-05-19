import React from 'react';
import Lottie from 'react-lottie';
import LottieData from './Animation - 1716126393409.json';

export default function Sun_Lottie() {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: LottieData,
    };

    return (
        <Lottie
            options={defaultOptions}
            height={500}
            width={500}
            isClickToPauseDisabled={true}
        />
    );
}