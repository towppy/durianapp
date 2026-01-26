import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isTablet = width >= 768;
const isSmallScreen = width < 375;

export default StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  
  // Hero Section
  hero: {
    width: '100%',
    height: isSmallScreen ? height * 0.35 : isWeb ? height * 0.45 : height * 0.4,
    backgroundColor: '#6b7280',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  
  // Card/Content Area
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: isSmallScreen ? 20 : 24,
    borderTopRightRadius: isSmallScreen ? 20 : 24,
    marginTop: isSmallScreen ? -20 : -24,
    paddingHorizontal: isSmallScreen ? 16 : isWeb ? 32 : 24,
    paddingTop: isSmallScreen ? 24 : 32,
    paddingBottom: isWeb ? 48 : 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  
  // ScrollView Container
  scrollContainer: {
    flexGrow: 1,
  },
  
  // Titles
  title: {
    fontSize: isSmallScreen ? 22 : isWeb ? 28 : 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: isSmallScreen ? 12 : 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: isSmallScreen ? 14 : isWeb ? 18 : 16,
    color: '#4b5563',
    marginBottom: isSmallScreen ? 16 : 24,
    textAlign: 'center',
    lineHeight: isSmallScreen ? 20 : 24,
  },
  
  // Text Styles
  italic: {
    fontStyle: 'italic',
    fontSize: isSmallScreen ? 13 : 14,
  },
  bold: {
    fontWeight: '600',
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: isSmallScreen ? 12 : 16,
    width: '100%',
  },
  thickDivider: {
    height: 2,
    backgroundColor: '#1f2937',
    marginVertical: isSmallScreen ? 12 : 16,
    width: '100%',
  },
  
  // Descriptions
  description: {
    fontSize: isSmallScreen ? 13 : 14,
    color: '#374151',
    textAlign: 'center',
    lineHeight: isSmallScreen ? 20 : 22,
    marginBottom: isSmallScreen ? 12 : 16,
  },
  descriptionLeft: {
    fontSize: isSmallScreen ? 13 : 14,
    color: '#374151',
    textAlign: 'left',
    lineHeight: isSmallScreen ? 20 : 22,
    marginBottom: isSmallScreen ? 12 : 16,
  },
  
  // Buttons
  button: {
    backgroundColor: '#047857',
    paddingVertical: isSmallScreen ? 14 : 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    minHeight: isSmallScreen ? 50 : 56,
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#047857',
    paddingVertical: isSmallScreen ? 14 : 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    minHeight: isSmallScreen ? 50 : 56,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: isSmallScreen ? 15 : 16,
    fontWeight: '600',
  },
  buttonSecondaryText: {
    color: '#047857',
    fontSize: isSmallScreen ? 15 : 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    opacity: 0.7,
  },
  
  // "OR" separator
  or: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: isSmallScreen ? 13 : 14,
    fontWeight: '500',
    marginVertical: isSmallScreen ? 12 : 16,
  },
  
  // Inputs
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingVertical: isSmallScreen ? 12 : 14,
    paddingHorizontal: isSmallScreen ? 14 : 16,
    fontSize: isSmallScreen ? 15 : 16,
    color: '#1f2937',
    marginBottom: isSmallScreen ? 12 : 16,
    backgroundColor: '#f9fafb',
    minHeight: isSmallScreen ? 48 : 52,
  },
  inputError: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  inputLabel: {
    fontSize: isSmallScreen ? 14 : 15,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  inputContainer: {
    marginBottom: isSmallScreen ? 16 : 20,
  },
  
  // Back Button
  backButton: {
    marginTop: isSmallScreen ? 16 : 20,
    alignItems: 'center',
    paddingVertical: 10,
  },
  backText: {
    color: '#047857',
    fontSize: isSmallScreen ? 15 : 16,
    fontWeight: '600',
  },
  
  // Error Text
  errorText: {
    color: '#dc2626',
    fontSize: isSmallScreen ? 12 : 13,
    marginTop: 4,
    marginBottom: 8,
  },
  
  // Loading Indicator
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 12,
    color: '#4b5563',
    fontSize: 14,
  },
  
  // Form Container
  formContainer: {
    width: '100%',
    maxWidth: isWeb ? 480 : '100%',
    alignSelf: 'center',
  },
  
  // Card Variants
  infoCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: isSmallScreen ? 16 : 20,
    marginBottom: isSmallScreen ? 16 : 20,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  warningCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: isSmallScreen ? 16 : 20,
    marginBottom: isSmallScreen ? 16 : 20,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  
  // Image Styles
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageContainer: {
    width: isSmallScreen ? 80 : 100,
    height: isSmallScreen ? 80 : 100,
    borderRadius: 50,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: '#e5e7eb',
  },
  
  // Row/Column Layouts
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallScreen ? 8 : 12,
  },
  column: {
    flexDirection: 'column',
    gap: isSmallScreen ? 8 : 12,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Spacing
  mt8: { marginTop: isSmallScreen ? 6 : 8 },
  mt12: { marginTop: isSmallScreen ? 10 : 12 },
  mt16: { marginTop: isSmallScreen ? 12 : 16 },
  mt20: { marginTop: isSmallScreen ? 16 : 20 },
  mt24: { marginTop: isSmallScreen ? 20 : 24 },
  
  mb8: { marginBottom: isSmallScreen ? 6 : 8 },
  mb12: { marginBottom: isSmallScreen ? 10 : 12 },
  mb16: { marginBottom: isSmallScreen ? 12 : 16 },
  mb20: { marginBottom: isSmallScreen ? 16 : 20 },
  mb24: { marginBottom: isSmallScreen ? 20 : 24 },
  
  pt8: { paddingTop: isSmallScreen ? 6 : 8 },
  pt12: { paddingTop: isSmallScreen ? 10 : 12 },
  pt16: { paddingTop: isSmallScreen ? 12 : 16 },
  pt20: { paddingTop: isSmallScreen ? 16 : 20 },
  pt24: { paddingTop: isSmallScreen ? 20 : 24 },
  
  pb8: { paddingBottom: isSmallScreen ? 6 : 8 },
  pb12: { paddingBottom: isSmallScreen ? 10 : 12 },
  pb16: { paddingBottom: isSmallScreen ? 12 : 16 },
  pb20: { paddingBottom: isSmallScreen ? 16 : 20 },
  pb24: { paddingBottom: isSmallScreen ? 20 : 24 },
  
  // Grid System
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  col6: {
    width: '50%',
    paddingHorizontal: 8,
  },
  col12: {
    width: '100%',
    paddingHorizontal: 8,
  },
  
  // Safe Area
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
    paddingBottom: Platform.OS === 'ios' ? 34 : 0,
  },
});