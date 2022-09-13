import { Text, TextProps } from './Themed';

export function MonoText(props: TextProps) {
  return (
    // eslint-disable-next-line react/destructuring-assignment
    <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} />
  );
}
