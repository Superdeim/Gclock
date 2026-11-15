import { createWidget, type WidgetEnvironment } from 'expo-widgets';
import { Column, Row, Spacer, Text } from '@expo/ui/jetpack-compose';
import {
  fillMaxSize,
  paddingAll,
} from '@expo/ui/jetpack-compose/modifiers';

type GClockWidgetProps = {
  timestamp: number;
};

function GClockWidgetView(
  props: GClockWidgetProps,
  environment: WidgetEnvironment,
) {
  'widget';

  const date = new Date(props.timestamp);
  const eyesAwake = date.getHours() === 0;
  const mainColor = environment.colorScheme === 'dark' ? '#FFFFFF' : '#152A2D';
  const detailColor = environment.colorScheme === 'dark' ? '#D0D9D4' : '#536563';
  const time = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Column modifiers={[fillMaxSize(), paddingAll(12)]}>
      <Row>
        <Text color={mainColor} style={{ fontSize: 12, fontWeight: '800' }}>
          GCLOCK
        </Text>
        <Spacer />
        <Text color={detailColor} style={{ fontSize: 10, fontWeight: '600' }}>
          {eyesAwake ? 'EYES OPEN' : 'LOCAL TIME'}
        </Text>
      </Row>
      <Text color={mainColor} style={{ fontSize: 38, fontWeight: '700' }}>
        {time}
      </Text>
      <Row>
        <Text color={mainColor} style={{ fontSize: 30 }}>
          {eyesAwake ? '\u{1F440}' : ''}
        </Text>
        <Text color={detailColor} style={{ fontSize: 12, fontWeight: '500' }}>
          {eyesAwake ? 'still up?' : 'back at midnight'}
        </Text>
      </Row>
    </Column>
  );
}

export default createWidget('GClockWidget', GClockWidgetView, {
  timestamp: Date.now(),
});