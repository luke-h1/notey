import { gql, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet } from 'react-native';
import ProjectItem from '../components/ProjectItem';
import { View } from '../components/Themed';

export default function ProjectsScreen() {
  const MY_PROJECTS_QUERY = gql`
    query myTaskLists {
      id
      title
      createdAt
    }
  `;

  const { data, loading, error } = useQuery(MY_PROJECTS_QUERY);

  useEffect(() => {
    if (error) {
      Alert.alert(error.message, 'error fetching projects');
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setProjects(data);
    }
  }, [data]);

  const [projects, setProjects] = useState([]);

  return (
    <View style={styles.container}>
      {/* Project/Task list */}
      {loading && <ActivityIndicator />}
      <FlatList
        data={projects}
        renderItem={({ item }) => <ProjectItem project={item} />}
        keyExtractor={item => item.id.toString()}
        style={{ width: '100%' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
