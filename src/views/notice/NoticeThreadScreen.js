// src/views/notice/NoticeThreadScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getComments, addComment } from '../../controllers/noticeController';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../theme/colors';
import Toast from 'react-native-toast-message';

export default function NoticeThreadScreen({ route }) {
  const { noticeId } = route.params;
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getComments(noticeId, 200);
      setComments(data);
    } catch (err) {
      console.error(err);
      Toast.show({ type: 'error', text1: 'Failed to load comments' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!text.trim()) return;
    try {
      await addComment({ notice_id: noticeId, author_id: user.id, content: text.trim() });
      setText('');
      load();
    } catch (err) {
      console.error(err);
      Toast.show({ type: 'error', text1: 'Failed to add comment' });
    }
  };

  return (
    <View style={{ flex: 1, padding: 12, backgroundColor: COLORS.bgLight }}>
      <FlatList
        data={comments}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={{ fontWeight: '600' }}>{item.author?.name || 'Unknown'}</Text>
            <Text style={{ color: COLORS.textMuted }}>{item.content}</Text>
            <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>{new Date(item.created_at).toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={() => <Text style={{ color: COLORS.textMuted }}>No comments yet</Text>}
      />

      <View style={styles.footer}>
        <TextInput value={text} onChangeText={setText} placeholder="Write a comment..." style={styles.input} />
        <TouchableOpacity style={styles.btn} onPress={handleAdd}>
          <Text style={{ color: '#fff' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  comment: { padding: 10, backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  footer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  input: { flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: '#eee', marginRight: 8 },
  btn: { backgroundColor: COLORS.primary, padding: 10, borderRadius: 8 },
});
