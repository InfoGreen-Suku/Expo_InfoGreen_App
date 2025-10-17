import { Dimensions, PixelRatio } from "react-native";

// Responsive font scaler based on screen width (guideline width: 360)
export const scaleFont = (size: number) => {
    const { width } = Dimensions.get('window');
    const guidelineBaseWidth = 360; // adjust if your designs use a different base
    const scale = width / guidelineBaseWidth;
    const scaled = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(scaled));
};