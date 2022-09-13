import { gql, useMutation } from '@apollo/client';
import React, { useEffect, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  View,
  TextInput,
} from 'react-native';
import { Todo } from '../../types';
import Checkbox from './Checkbox';

interface Props {
  todo: Todo;
  onSubmit: () => void;
}

const TodoItem = ({ todo, onSubmit }: Props) => {
  const [checked, setChecked] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setChecked(todo.completed);
    setContent(todo.content);
  }, [todo]);

  useEffect(() => {
    // Focus on the input when the todo is created
    inputRef?.current?.focus();
  }, [inputRef]);

  const onKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && content === '') {
      // delete todo if content is empty
      console.warn('delete todo');
    }
  };

  const UPDATE_TODO_MUTATION = gql`
    mutation updateTodo($id: ID!, $content: String, $completed: Boolean) {
      updateTodo(id: $id, content: $content, completed: $completed) {
        id
        content
        completed

        taskList {
          title
          progress
          todos {
            id
            content
            completed
          }
        }
      }
    }
  `;

  const [updateItem] = useMutation(UPDATE_TODO_MUTATION, {});

  const callUpdateItem = () => {
    updateItem({
      variables: {
        id: todo.id,
        content,
        completed: checked,
      },
    });
  };

  useEffect(() => {
    setChecked(todo.completed);
    setContent(todo.content);
  }, [todo]);

  return (
    <View style={{ flexDirection: 'row', marginVertical: 3 }}>
      <Checkbox
        checked={checked}
        onPress={() => {
          setChecked(!checked);
          callUpdateItem();
        }}
      />
      <TextInput
        ref={inputRef}
        value={content}
        onChangeText={setContent}
        style={{
          flex: 1,
          color: '#000',
          fontSize: 18,
          marginLeft: 12,
        }}
        multiline
        onSubmitEditing={onSubmit}
        blurOnSubmit
        onEndEditing={callUpdateItem}
        onKeyPress={onKeyPress}
      />
    </View>
  );
};
export default TodoItem;
