import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  Pressable,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { useAppTheme } from '@/theme';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

type ProfileData = {
  avatar?: string | null; // uri
  fullName: string;
  email: string;
  phone?: string;
  dob?: string; // ISO date or formatted
  joinedAt?: string;
};

export default function ProfileScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  // Mocked initial profile (in real app fetch from API / store)
  const [profile, setProfile] = useState<ProfileData>({
    avatar: null,
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '+84 912 345 678',
    dob: '1990-05-12',
    joinedAt: '2023-04-01',
  });

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileData>(profile);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);

  const openEdit = () => {
    setDraft(profile);
    setEditing(true);
  };

  const saveEdit = () => {
    // validate basic fields
    const updated: ProfileData = {
      ...draft,
      fullName: draft.fullName.trim() || profile.fullName,
      email: draft.email.trim() || profile.email,
    };
    setProfile(updated);
    console.log('Saved profile:', updated);
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const handleLogout = () => {
    console.log('Logout pressed');
    // integrate with auth/logout logic / navigation
  };

  const pickAvatar = () => {
    // placeholder - integrate ImagePicker here
    console.log('Open avatar picker (integrate react-native-image-picker or similar)');
    setAvatarPickerOpen(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('profile.title') ?? 'Profile'}</Text>
        <Button title={t('common.edit') ?? 'Edit'} variant="ghost" onPress={openEdit} />
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setAvatarPickerOpen(true)}
          style={[styles.avatarWrap, { borderColor: theme.border }]}
        >
          {profile.avatar ? (
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.surface }]}>
              <Text style={{ color: theme.muted, fontWeight: '700' }}>
                {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : '?'}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.info}>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.muted }]}>{t('profile.name') ?? 'Full name'}</Text>
            <Text style={[styles.value, { color: theme.text }]}>{profile.fullName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.muted }]}>{t('profile.email') ?? 'Email'}</Text>
            <Text style={[styles.value, { color: theme.text }]}>{profile.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.muted }]}>{t('profile.phone') ?? 'Phone'}</Text>
            <Text style={[styles.value, { color: theme.text }]}>{profile.phone ?? '—'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.muted }]}>{t('profile.dob') ?? 'DOB'}</Text>
            <Text style={[styles.value, { color: theme.text }]}>{profile.dob ?? '—'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.muted }]}>{t('profile.joined') ?? 'Joined'}</Text>
            <Text style={[styles.value, { color: theme.text }]}>{profile.joinedAt ?? '—'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Button title={t('profile.change_password') ?? 'Change password'} variant="secondary" onPress={() => console.log('Change password')} />
        <Button title={t('profile.logout') ?? 'Logout'} variant="ghost" onPress={handleLogout} style={{ marginLeft: 12 }} />
      </View>

      {/* Avatar picker modal (placeholder) */}
      <Modal visible={avatarPickerOpen} transparent animationType="fade" onRequestClose={() => setAvatarPickerOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setAvatarPickerOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>{t('profile.change_avatar') ?? 'Change avatar'}</Text>
                <Pressable style={styles.modalBtn} onPress={() => { pickAvatar(); }}>
                  <Text style={{ color: theme.text }}>Pick from gallery</Text>
                </Pressable>
                <Pressable style={styles.modalBtn} onPress={() => { setProfile((p) => ({ ...p, avatar: null })); setAvatarPickerOpen(false); }}>
                  <Text style={{ color: theme.text }}>Remove avatar</Text>
                </Pressable>
                <Pressable style={[styles.modalBtn, { marginTop: 8 }]} onPress={() => setAvatarPickerOpen(false)}>
                  <Text style={{ color: theme.muted }}>Cancel</Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Edit modal */}
      <Modal visible={editing} transparent animationType="slide" onRequestClose={cancelEdit}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.editOverlay}>
            <View style={[styles.editCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.editTitle, { color: theme.text }]}>{t('profile.edit_profile') ?? 'Edit profile'}</Text>

              <Text style={[styles.inputLabel, { color: theme.muted }]}>{t('profile.name') ?? 'Full name'}</Text>
              <TextInput
                value={draft.fullName}
                onChangeText={(v) => setDraft((d) => ({ ...d, fullName: v }))}
                style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                placeholder={t('profile.name') ?? 'Full name'}
                placeholderTextColor={theme.muted}
                returnKeyType="next"
              />

              <Text style={[styles.inputLabel, { color: theme.muted }]}>{t('profile.email') ?? 'Email'}</Text>
              <TextInput
                value={draft.email}
                onChangeText={(v) => setDraft((d) => ({ ...d, email: v }))}
                style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                placeholder="email@example.com"
                placeholderTextColor={theme.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />

              <Text style={[styles.inputLabel, { color: theme.muted }]}>{t('profile.phone') ?? 'Phone'}</Text>
              <TextInput
                value={draft.phone}
                onChangeText={(v) => setDraft((d) => ({ ...d, phone: v }))}
                style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                placeholder="+84 9xx xxx xxx"
                placeholderTextColor={theme.muted}
                keyboardType="phone-pad"
                returnKeyType="done"
              />

              <View style={styles.editActions}>
                <Button title={t('common.cancel') ?? 'Cancel'} variant="ghost" onPress={cancelEdit} />
                <Button title={t('common.save') ?? 'Save'} variant="primary" onPress={saveEdit} style={{ marginLeft: 12 }} />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const AVATAR_SIZE = 88;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },

  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16 as any,
  },

  avatarWrap: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  info: {
    flex: 1,
  },
  infoRow: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
  },

  actions: {
    flexDirection: 'row',
    marginTop: 24,
    paddingHorizontal: 2,
  },

  /* Avatar picker modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalBtn: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
    alignItems: 'center',
  },

  /* Edit modal */
  editOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  editCard: {
    width: '100%',
    maxWidth: 640,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  editTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    height: Platform.OS === 'ios' ? 44 : 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
});