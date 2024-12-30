import * as React from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import StepIndicator from 'react-native-step-indicator';

const stepIndicatorStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 3,
  currentStepStrokeWidth: 5,
  stepStrokeCurrentColor: '#fe7013',
  separatorFinishedColor: '#fe7013',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#fe7013',
  stepIndicatorUnFinishedColor: '#aaaaaa',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 15,
  currentStepIndicatorLabelFontSize: 15,
  stepIndicatorLabelCurrentColor: '#000000',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: 'rgba(255,255,255,0.5)',
  labelColor: '#666666',
  labelSize: 15,
  currentStepLabelColor: '#fe7013',
};

const Step1Component = () => {
  return (
    <View style={styles.stepComponent}>
      <Text>Step 1</Text>
      <Text>Step 1</Text>
      <Text>Step 1</Text>
      <Text>Step 1</Text>
      <Text>Step 1</Text>
      <Text>Step 1</Text>
      <Text>Step 1</Text>
      <Text>Step 1</Text>
      <Text>Step 1</Text>
      <Text>Step 1</Text>
    </View>
  );
};

const Step2Component = () => {
  return (
    <View style={styles.stepComponent}>
      <Text>Step 2</Text>
      <Text>Step 2</Text>
      <Text>Step 2</Text>
      <Text>Step 2</Text>
      <Text>Step 2</Text>
      <Text>Step 2</Text>
      <Text>Step 2</Text>
      <Text>Step 2</Text>
      <Text>Step 2</Text>
      <Text>Step 2</Text>
    </View>
  );
};

const Step3Component = () => {
  return (
    <View style={styles.stepComponent}>
      <Text>Step 3</Text>
      <Text>Step 3</Text>
      <Text>Step 3</Text>
      <Text>Step 3</Text>
      <Text>Step 3</Text>
      <Text>Step 3</Text>
      <Text>Step 3</Text>
      <Text>Step 3</Text>
      <Text>Step 3</Text>
      <Text>Step 3</Text>
      <Text>Step 3</Text>
      <Text>Step 3</Text>
      <Text>Step 3</Text>
    </View>
  );
};

const Step4Component = () => {
  return (
    <View style={styles.stepComponent}>
      <Text>Step 4</Text>
      <Text>Step 4</Text>
      <Text>Step 4</Text>
      <Text>Step 4</Text>
      <Text>Step 4</Text>
      <Text>Step 4</Text>
      <Text>Step 4</Text>
      <Text>Step 4</Text>
      <Text>Step 4</Text>
      <Text>Step 4</Text>
      <Text>Step 4</Text>
      <Text>Step 4</Text>
    </View>
  );
};

export default function VerticalStepIndicator() {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [currentStep, setCurrentStep] = React.useState(0);

  const dummyData = [
    {
      component: Step1Component,
    },
    {
      component: Step2Component,
    },
    {
      component: Step3Component,
    },
    {
      component: Step4Component,
    },
  ];

  const renderComponent = ({item, index}) => {
    const Component = item.component;
    return (
      <View style={styles.componentContainer}>
        <Component />
      </View>
    );
  };

  const onViewableItemsChanged = React.useCallback(({viewableItems}) => {
    const visibleItemsCount = viewableItems.length;
    if (visibleItemsCount !== 0) {
      setCurrentPage(viewableItems[visibleItemsCount - 1].index);
    }
  }, []);

  React.useEffect(() => {
    if (currentPage === 2 && currentStep !== 2) {
      setCurrentStep(2);
    }
  }, [currentPage]);

  return (
    <View style={styles.container}>
      <View style={styles.stepIndicatorContainer}>
        <StepIndicator
          customStyles={stepIndicatorStyles}
          stepCount={dummyData.length}
          direction="horizontal"
          currentPosition={1}
          labels={dummyData.map((_, index) => '')}
        />
      </View>
      <FlatList
        style={{flex: 1}}
        data={dummyData}
        renderItem={renderComponent}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{itemVisiblePercentThreshold: 40}}
        horizontal
        pagingEnabled
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
  },
  stepIndicatorContainer: {
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  componentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepComponent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
});
