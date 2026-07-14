import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { COLORS, SPACING, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft, User, Mail, Phone, Camera, CheckCircle } from '../components/CustomIcon';

interface EditProfileScreenProps {
  onBack: () => void;
}

export default function EditProfileScreen({ onBack }: EditProfileScreenProps) {
  const [photoSelected, setPhotoSelected] = useState(false);
  const [name, setName] = useState('Ahmed Hassan');
  const [email, setEmail] = useState('ahmed@email.com');
  const [phone, setPhone] = useState('+880 1711 234567');
  const [lang, setLang] = useState('English');
  const [about, setAbout] = useState('Managing our family bazar hisab since 2024.');
  
  const [street, setStreet] = useState('42 Mirpur Road');
  const [city, setCity] = useState('Dhaka');
  const [state, setState] = useState('Dhaka Division');
  const [zip, setZip] = useState('1216');
  const [country, setCountry] = useState('Bangladesh');

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Focus states
  const [fName, setFName] = useState(false);
  const [fEmail, setFEmail] = useState(false);
  const [fPhone, setFPhone] = useState(false);
  const [fLang, setFLang] = useState(false);
  const [fAbout, setFAbout] = useState(false);
  
  const [fStreet, setFStreet] = useState(false);
  const [fCity, setFCity] = useState(false);
  const [fState, setFState] = useState(false);
  const [fZip, setFZip] = useState(false);
  const [fCountry, setFCountry] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onBack();
      }, 1500);
    }, 1200);
  };

  const renderField = (
    label: string,
    value: string,
    setValue: (v: string) => void,
    focused: boolean,
    setFocused: (b: boolean) => void,
    icon: React.ReactNode,
    keyboardType: 'default' | 'email-address' | 'phone-pad' = 'default'
  ) => (
    <View style={styles.fieldBox}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputWrapper, focused && styles.inputWrapperFocused]}>
        <View style={styles.fieldIcon}>{icon}</View>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={setValue}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoCorrect={false}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
        <ArrowLeft color={COLORS.textSecondary} size={16} />
        <Text style={styles.backButtonText}>Profile</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.screenHeader}>
          <Text style={styles.screenTitle}>
            Edit <Text style={{ color: COLORS.primary }}>Profile</Text>
          </Text>
        </View>

        {/* Mock Photo picker */}
        <View style={styles.photoPickerContainer}>
          <TouchableOpacity
            style={styles.photoPickerCircle}
            onPress={() => setPhotoSelected(!photoSelected)}
            activeOpacity={0.8}
          >
            {photoSelected ? (
              <View style={[styles.avatarCircle, { backgroundColor: '#3d7a5c' }]}>
                <Text style={styles.avatarInitials}>AH</Text>
              </View>
            ) : (
              <View style={[styles.avatarCircle, { backgroundColor: '#c06010' }]}>
                <Text style={styles.avatarInitials}>AH</Text>
              </View>
            )}
            <View style={styles.cameraBadge}>
              <Camera color={COLORS.textOnPrimary} size={12} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Section 1: Basic Info */}
        <View style={styles.sectionDividerRow}>
          <Text style={styles.sectionDividerText}>Basic Info</Text>
          <View style={styles.sectionDividerLine} />
        </View>

        {renderField('Full Name', name, setName, fName, setFName, <User color={COLORS.textSecondary} size={16} />)}
        {renderField('Email Address', email, setEmail, fEmail, setFEmail, <Mail color={COLORS.textSecondary} size={16} />, 'email-address')}
        {renderField('Phone Number', phone, setPhone, fPhone, setFPhone, <Phone color={COLORS.textSecondary} size={16} />, 'phone-pad')}
        {renderField('Language', lang, setLang, fLang, setFLang, <User color={COLORS.textSecondary} size={16} />)}
        
        {/* About Me */}
        <View style={styles.fieldBox}>
          <Text style={styles.fieldLabel}>About Me</Text>
          <View style={[styles.inputWrapper, fAbout && styles.inputWrapperFocused, styles.textAreaWrapper]}>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={about}
              onChangeText={setAbout}
              onFocus={() => setFAbout(true)}
              onBlur={() => setFAbout(false)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Section 2: Address */}
        <View style={styles.sectionDividerRow}>
          <Text style={styles.sectionDividerText}>Address</Text>
          <View style={styles.sectionDividerLine} />
        </View>

        {renderField('Street', street, setStreet, fStreet, setFStreet, <User color={COLORS.textSecondary} size={16} />)}
        {renderField('City', city, setCity, fCity, setFCity, <User color={COLORS.textSecondary} size={16} />)}
        {renderField('State / Division', state, setState, fState, setFState, <User color={COLORS.textSecondary} size={16} />)}
        {renderField('ZIP Code', zip, setZip, fZip, setFZip, <User color={COLORS.textSecondary} size={16} />)}
        {renderField('Country', country, setCountry, fCountry, setFCountry, <User color={COLORS.textSecondary} size={16} />)}

        {/* Save button / Success feedback */}
        <View style={{ marginTop: 12 }}>
          {saved ? (
            <View style={styles.successMessageCard}>
              <CheckCircle color="#22c55e" size={18} />
              <Text style={styles.successMessageText}>Profile updated!</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.textOnPrimary} size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Save Profile</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: 'sans-serif',
    marginLeft: 6,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  screenHeader: {
    marginBottom: 20,
    marginTop: 10,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'serif',
  },
  photoPickerContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  photoPickerCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: 'rgba(232, 160, 32, 0.4)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'sans-serif',
  },
  cameraBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    bottom: -2,
    right: -2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  sectionDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
    gap: 12,
  },
  sectionDividerText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sectionDividerLine: {
    flex: 1,
    height: 1.2,
    backgroundColor: COLORS.border,
  },
  fieldBox: {
    marginBottom: 16,
    width: '100%',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(245, 237, 226, 0.8)',
    marginBottom: 8,
    fontFamily: 'sans-serif',
  },
  inputWrapper: {
    height: 52,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapperFocused: {
    borderColor: COLORS.borderFocus,
  },
  fieldIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    paddingVertical: 0,
    fontFamily: 'sans-serif',
  },
  textAreaWrapper: {
    height: 96,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  textArea: {
    height: '100%',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    ...SHADOWS.md,
  },
  primaryButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
  successMessageCard: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  successMessageText: {
    color: '#22c55e',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
});
