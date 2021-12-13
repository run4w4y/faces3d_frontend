const config = {
    NUM_SEGMENTS: 32,
    VISIBILITY_RATE: 0.4,
    CONFIDENCE_RATE: 0.95,
    MIN_POSITION: 10,
    MAX_POSITION: 30,
    IMAGE_SIZE: 300,
    EXTEND: 1.5,
    index: {
        silhouette: [
            454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152,
            148, 176, 149, 150, 136, 172, 58, 132, 93, 234
        ],
        lipsUpperOuter: [61, 40, 39, 37, 0, 267, 269, 270, 291],
        rightEyebrowUpper: [156, 70, 63, 105, 66, 107, 55, 193],
        leftEyebrowUpper: [383, 300, 293, 334, 296, 336, 285, 417],
        rightEyeLower0: [33, 144, 153, 133],
        leftEyeLower0: [263, 373, 380, 362],
        nose: [4, 5, 195, 197, 6, 8],
    },
    s3url: 'https://storage.yandexcloud.net/toloka-open/video',
    timerLimit: 20,
};

export default config;
