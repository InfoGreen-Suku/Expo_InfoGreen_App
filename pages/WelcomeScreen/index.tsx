import { scaleFont } from '@/constants/ScaleFont'; // Assuming this utility is available
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Dimensions, FlatList, Image, Text, TouchableHighlight, View } from 'react-native';
import { styles } from './style'; // Assuming styles are defined here

// --- Page Data Definition ---
const PAGES = [
  {
    imageSource: require('../../assets/images/Capture.png'),
    title: 'Effortless GST Invoicing',
    subtitle: 'Streamline your invoicing process with our user-friendly GST billing app. Say goodbye to manual calculations and paperwork.',
  },
  {
    imageSource: require('../../assets/images/Capture2.png'),
    title: 'Stay Compliant, Stay Confident',
    subtitle: 'Ensure GST compliance effortlessly with our intuitive app. Generate accurate invoices and reports, and stay ahead of regulatory changes',
  },
  {
    imageSource: require('../../assets/images/Capture3.png'),
    title: 'Boost Productivity, Minimize Errors',
    subtitle: 'Maximize efficiency in your business operations with our GST billing solution. Reduce errors, save time, and focus on growth.',
  },
];

const TOTAL_PAGES = PAGES.length;
const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;
export default function WelcomeScreen() {
  const navigation = useNavigation<any>();
  // State to track the current onboarding page index
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const flatListRef = useRef<FlatList<any> | null>(null);

  // --- Hardware Back Button Handler ---
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Exit the app when back button is pressed on the onboarding screen
        BackHandler.exitApp();
        return true;
      },
    );
    return () => backHandler.remove(); // Cleanup the event listener
  }, []);

  // --- Navigation Handlers ---
  const handleStart = () => {
    navigation.navigate("Login");
  };

  const handleNext = () => {
    if (currentPageIndex < TOTAL_PAGES - 1) {
      const nextIndex = currentPageIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentPageIndex(nextIndex);
    }
  };

  // --- Custom Components (Recreated) ---

  // Customized DOT indicator
  const DotComponent = ({ index }: { index: number }) => {
    const selected = index === currentPageIndex;
    return (
      <TouchableHighlight underlayColor={'transparent'} onPress={() => { setCurrentPageIndex(index); flatListRef.current?.scrollToIndex({ index, animated: true }); }}
        key={index}
        style={[
          styles.dotcomponent, // Assuming styles.dotcomponent exists
          selected && { paddingHorizontal: 4, paddingVertical: 1, backgroundColor: '#009333' },
        ]}>
        <View
          style={[
            styles.dotsub, // Assuming styles.dotsub exists
            selected ? { backgroundColor: '#009333', borderRadius: 5 } : '',
          ]}></View>
      </TouchableHighlight>
    );
  };

  // Customized DONE/START button
  const DoneButtonComponent = () => {
    return (
      <View style={{ width: 100, padding: 8, alignItems: 'center' }}>
        <TouchableHighlight
          style={{ backgroundColor: '#009333', borderRadius: 10, padding: 6 }}
          underlayColor={'transparent'}
          onPress={handleStart}
        >
          <Text style={{ color: '#fff', fontSize: scaleFont(17), fontWeight: 400 }}>START</Text>
        </TouchableHighlight>
      </View>
    );
  };

  // Customized NEXT button
  const NextButtonComponent = () => {
    return (
      <View style={{ width: 100, padding: 8, alignItems: 'center' }}>
        <TouchableHighlight
          style={{ backgroundColor: '#009333', borderRadius: 10, padding: 6 }}
          underlayColor={'transparent'}
          onPress={handleNext}
        >
          <Text style={{ color: '#fff', fontSize: scaleFont(17), fontWeight: 400 }}>NEXT</Text>
        </TouchableHighlight>
      </View>
    );
  };

  // --- Main Render Logic ---
  const currentPage = PAGES[currentPageIndex];
  const isLastPage = currentPageIndex === TOTAL_PAGES - 1;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>

      {/* Current Onboarding Content (Swipeable) */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <FlatList
          ref={flatListRef}
          data={PAGES}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center' }}
          getItemLayout={(_, index) => ({ length: ScreenWidth, offset: ScreenWidth * index, index })}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / ScreenWidth);
            setCurrentPageIndex(index);
          }}
          renderItem={({ item }) => (
            <View style={{ width: ScreenWidth, height: ScreenHeight - (ScreenHeight * 0.1 + 10), paddingHorizontal: scaleFont(20), alignItems: 'center', justifyContent: 'center' }}>
              <Image style={styles.image} source={item.imageSource} />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          )}
        />
      </View>

      {/* Bottom Bar (Dots and Buttons) */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 10,
          height: ScreenHeight * 0.1,
          marginBottom: 10,
        }}
      >

        <View style={{ width: 100 }} />

        {/* Dots Indicator */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1 }}>
          {PAGES.map((_, index) => (
            <DotComponent key={index} index={index} />
          ))}
        </View>

        {/* Next/Done Button */}
        {isLastPage ? <DoneButtonComponent /> : <NextButtonComponent />}
      </View>
    </View>
  );
}