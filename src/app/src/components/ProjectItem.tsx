import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet } from 'react-native';
import { Project } from '../../types';
import { Text, View } from './Themed';

interface Props {
  project: Project;
}

const ProjectItem = ({ project }: Props) => {
  const navigation = useNavigation();

  const onPress = () => navigation.navigate('Todos', { id: project.id });

  return (
    <Pressable style={styles.root} onPress={onPress}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="file-outline" size={24} color="grey" />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text style={styles.title}>{project.title}</Text>
        <Text style={styles.time}>{project.createdAt}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    width: '100%',
    padding: 10,
  },
  iconContainer: {
    marginRight: 10,
    width: 40,
    height: 40,
    backgroundColor: '#404040',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  title: {
    marginRight: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
  time: {
    color: 'darkgrey',
  },
});
export default ProjectItem;
