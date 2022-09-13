import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GestureResponderEvent, Pressable } from 'react-native';

interface Props {
  checked: boolean;
  onPress: (event: GestureResponderEvent) => void;
}

const Checkbox = ({ checked, onPress }: Props) => {
  return (
    <Pressable onPress={onPress}>
      <MaterialCommunityIcons
        name={`checkbox-${checked ? 'marked' : 'blank'}-outline`}
        size={24}
        color="black"
      />
    </Pressable>
  );
};
export default Checkbox;
