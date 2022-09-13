import { gql, useMutation, useQuery } from '@apollo/client';
import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Project } from '../../types';
import { Text, View } from '../components/Themed';
import TodoItem from '../components/TodoItem';

const GET_TASKLIST_QUERY = gql`
  query getTaskList($id: ID!) {
    id
    title
    createdAt
    todos {
      id
      content
      isCompleted
    }
  }
`;

const CREATE_TODO_MUTATION = gql`
  mutation createToDo($content: String!, $taskListId: ID!) {
    createToDo(content: $content, taskListId: $taskListId) {
      id
      content
      isCompleted

      taskList {
        id
        progress
        todos {
          id
          content
          isCompleted
        }
      }
    }
  }
`;

const TodoScreen = () => {
  const [title, setTitle] = useState<string>('');
  const [project, setProject] = useState(null);

  const route = useRoute();

  const { id } = route.params as { id: string };

  const { data, error, loading } = useQuery(GET_TASKLIST_QUERY, {
    variables: { id },
  });

  useEffect(() => {
    if (error) {
      Alert.alert(error.message, 'please try again');
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setTitle(data.taskList.title);
      setProject(data.taskList);
    }
  });

  const [createTodo] = useMutation(CREATE_TODO_MUTATION, {
    refetchQueries: [{ query: GET_TASKLIST_QUERY, variables: { id } }],
  });

  const createNewItem = () => {
    createTodo({
      variables: {
        content: '',
        taskListId: id,
      },
    });
  };

  if (!project) {
    return (
      <View>
        <Text>No project found</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0}
      enabled
    >
      <View style={styles.container}>
        <TextInput
          style={styles.title}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
        />
        <FlatList
          data={project.getTaskList.todos}
          renderItem={({ item, index }) => (
            <TodoItem todo={item} onSubmit={() => createNewItem()} />
          )}
          style={{ width: '100%' }}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  title: {
    width: '100%',
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 12,
  },
});

export default TodoScreen;
