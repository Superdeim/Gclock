import { createWidget, type WidgetEnvironment } from 'expo-widgets';
import { HStack, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import {
  containerBackground,
  font,
  foregroundStyle,
  monospacedDigit,
  padding,
} from '@expo/ui/swift-ui/modifiers';

type GClockWidgetProps = {
  timestamp: number;
};

function GClockWidgetView(
  props: GClockWidgetProps,
  environment: WidgetEnvironment,
) {
  'widget';

  const date = environment.date ?? new Date(props.timestamp);
  const eyesAwake = date.getHours() === 0;
  const mainColor = environment.colorScheme === 'dark' ? '#FFFFFF' : '#152A2D';
  const detailColor = environment.colorScheme === 'dark' ? '#D0D9D4' : '#536563';

  return (
    <VStack
      spacing={7}
      modifiers={[containerBackground('clear', 'widget'), padding({ all: 12 })]}
    >
      <HStack spacing={6}>
        <Text modifiers={[font({ weight: 'heavy', size: 12 }), foregroundStyle(mainColor)]}>
          GCLOCK
        </Text>
        <Spacer />
        <Text modifiers={[font({ weight: 'medium', size: 10 }), foregroundStyle(detailColor)]}>
          {eyesAwake ? 'EYES OPEN' : 'LOCAL TIME'}
        </Text>
      </HStack>
      <Text
        date={date}
        dateStyle="time"
        modifiers={[
          font({ design: 'rounded', weight: 'bold', size: 38 }),
          monospacedDigit(),
          foregroundStyle(mainColor),
        ]}
      />
      <HStack spacing={6}>
        <Text modifiers={[font({ size: 30 }), foregroundStyle(mainColor)]}>
          {eyesAwake ? '\u{1F440}' : ''}
        </Text>
        <Text modifiers={[font({ weight: 'medium', size: 12 }), foregroundStyle(detailColor)]}>
          {eyesAwake ? 'still up?' : 'back at midnight'}
        </Text>
      </HStack>
    </VStack>
  );
}

export default createWidget('GClockWidget', GClockWidgetView, {
  timestamp: Date.now(),
});