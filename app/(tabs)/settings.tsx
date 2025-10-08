import React from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@/theme';
import { changeLanguage } from '@/i18n';
import { View } from '@/components/Themed';
import { SettingsSection } from '@/components/ui/SettingsSection';
import { SettingsItem } from '@/components/ui/SettingsItem';
import { RadioButton } from '@/components/ui/RadioButton';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { theme, themeMode, setThemeMode } = useAppTheme();

  const currentLanguage = i18n.language;

  const handleLanguageChange = async (lang: 'en' | 'vi') => {
    try {
      await changeLanguage(lang);
    } catch (error) {
      Alert.alert('Error', 'Failed to change language');
    }
  };

  const handleThemeChange = async (mode: 'light' | 'dark' | 'system') => {
    try {
      await setThemeMode(mode);
    } catch (error) {
      Alert.alert('Error', 'Failed to change theme');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <SettingsSection title={t('settings.language.title')}>
          <SettingsItem
            title={t('settings.language.english')}
            rightElement={
              <RadioButton
                selected={currentLanguage === 'en'}
                onPress={() => handleLanguageChange('en')}
              />
            }
            showArrow={false}
          />
          <SettingsItem
            title={t('settings.language.vietnamese')}
            rightElement={
              <RadioButton
                selected={currentLanguage === 'vi'}
                onPress={() => handleLanguageChange('vi')}
              />
            }
            showArrow={false}
          />
        </SettingsSection>

        <SettingsSection title={t('settings.theme.title')}>
          <SettingsItem
            title={t('settings.theme.light')}
            rightElement={
              <RadioButton
                selected={themeMode === 'light'}
                onPress={() => handleThemeChange('light')}
              />
            }
            showArrow={false}
          />
          <SettingsItem
            title={t('settings.theme.dark')}
            rightElement={
              <RadioButton
                selected={themeMode === 'dark'}
                onPress={() => handleThemeChange('dark')}
              />
            }
            showArrow={false}
          />
          <SettingsItem
            title={t('settings.theme.system')}
            rightElement={
              <RadioButton
                selected={themeMode === 'system'}
                onPress={() => handleThemeChange('system')}
              />
            }
            showArrow={false}
          />
        </SettingsSection>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingTop: 20,
  },
});
