import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import {
  BorderRadius,
  Fonts,
  MaxContentWidth,
  NavyPalette,
  Spacing,
} from '@/constants/theme';

// =========================================================================
// STREAMLINED CODE INFO FOR EACH ELEMENT (NO CLUTTER, NO VERBOSE TEXT WALLS)
// =========================================================================
interface ElementCodeInfo {
  name: string;
  htmlTag: string;
  reactNativeComponent: string;
  purpose: string;
  codeSnippet: string;
  keyProps: string[];
}

const ELEMENT_CODE_INFO: { [key: string]: ElementCodeInfo } = {
  text: {
    name: 'Single-line Text Input',
    htmlTag: '<input type="text">',
    reactNativeComponent: '<TextInput />',
    purpose: 'Standard single-line text entry for names and alphanumeric strings.',
    codeSnippet: `<TextInput\n  value={name}\n  onChangeText={setName}\n  placeholder="Full Name"\n  autoCapitalize="words"\n/>`,
    keyProps: ['value', 'onChangeText', 'placeholder', 'autoCapitalize', 'maxLength'],
  },
  email: {
    name: 'Email Address Input',
    htmlTag: '<input type="email">',
    reactNativeComponent: '<TextInput keyboardType="email-address" inputMode="email" />',
    purpose: 'Email address entry with email-specific keyboard configuration.',
    codeSnippet: `<TextInput\n  value={email}\n  onChangeText={setEmail}\n  keyboardType="email-address"\n  inputMode="email"\n  autoCapitalize="none"\n  autoComplete="email"\n/>`,
    keyProps: ['keyboardType="email-address"', 'inputMode="email"', 'autoCapitalize="none"', 'autoComplete="email"'],
  },
  password: {
    name: 'Password Input',
    htmlTag: '<input type="password">',
    reactNativeComponent: '<TextInput secureTextEntry={true} />',
    purpose: 'Masks sensitive user credentials with show/hide toggle.',
    codeSnippet: `<TextInput\n  value={password}\n  onChangeText={setPassword}\n  secureTextEntry={!showPassword}\n  textContentType="password"\n/>`,
    keyProps: ['secureTextEntry', 'textContentType="password"', 'autoComplete="password"'],
  },
  otp: {
    name: 'OTP Verification Code',
    htmlTag: '<input autocomplete="one-time-code" maxlength="6">',
    reactNativeComponent: 'Discrete <TextInput maxLength={1} /> Cells',
    purpose: 'Multi-cell one-time passcode with individual digit entry.',
    codeSnippet: `otp.map((digit, i) => (\n  <TextInput\n    key={i}\n    maxLength={1}\n    keyboardType="number-pad"\n    value={digit}\n  />\n))`,
    keyProps: ['maxLength={1}', 'keyboardType="number-pad"', 'textContentType="oneTimeCode"'],
  },
  tel: {
    name: 'Telephone Input',
    htmlTag: '<input type="tel">',
    reactNativeComponent: '<TextInput keyboardType="phone-pad" inputMode="tel" />',
    purpose: 'Phone number entry with country dialing code prefix.',
    codeSnippet: `<TextInput\n  value={phone}\n  onChangeText={setPhone}\n  keyboardType="phone-pad"\n  inputMode="tel"\n/>`,
    keyProps: ['keyboardType="phone-pad"', 'inputMode="tel"', 'autoComplete="tel"'],
  },
  url: {
    name: 'Website URL Input',
    htmlTag: '<input type="url">',
    reactNativeComponent: '<TextInput keyboardType="url" inputMode="url" />',
    purpose: 'Web address entry field with URL keyboard formatting.',
    codeSnippet: `<TextInput\n  value={url}\n  onChangeText={setUrl}\n  keyboardType="url"\n  inputMode="url"\n  autoCapitalize="none"\n/>`,
    keyProps: ['keyboardType="url"', 'inputMode="url"', 'autoCapitalize="none"'],
  },
  search: {
    name: 'Search Input',
    htmlTag: '<input type="search">',
    reactNativeComponent: '<TextInput returnKeyType="search" inputMode="search" />',
    purpose: 'Search query field with clear button and search keyboard action.',
    codeSnippet: `<TextInput\n  value={query}\n  onChangeText={setQuery}\n  returnKeyType="search"\n  inputMode="search"\n/>`,
    keyProps: ['returnKeyType="search"', 'inputMode="search"', 'clearButtonMode'],
  },
  datalist: {
    name: 'Datalist Autocomplete',
    htmlTag: '<input list="suggestions"><datalist id="suggestions">',
    reactNativeComponent: '<TextInput /> with Filtered Suggestions Dropdown',
    purpose: 'Text input with suggested preset choices and custom entry.',
    codeSnippet: `<View>\n  <TextInput value={text} onChangeText={setText} />\n  {suggestions.map(s => <Pressable onPress={() => setText(s)}><Text>{s}</Text></Pressable>)}\n</View>`,
    keyProps: ['filter', 'suggestions', 'onSelectSuggestion'],
  },
  number: {
    name: 'Numeric Stepper Input',
    htmlTag: '<input type="number" min="1" max="50">',
    reactNativeComponent: '<TextInput keyboardType="numeric" /> with Stepper Buttons',
    purpose: 'Numeric quantity input with direct edit and [-] [+] stepper buttons.',
    codeSnippet: `<View style={styles.stepper}>\n  <Pressable onPress={dec}><Text>-</Text></Pressable>\n  <TextInput keyboardType="numeric" value={String(val)} />\n  <Pressable onPress={inc}><Text>+</Text></Pressable>\n</View>`,
    keyProps: ['keyboardType="numeric"', 'inputMode="numeric"', 'min', 'max'],
  },
  textarea: {
    name: 'Multiline Textarea',
    htmlTag: '<textarea rows="3">',
    reactNativeComponent: '<TextInput multiline={true} numberOfLines={3} />',
    purpose: 'Multiline text field for paragraphs, notes, and comments.',
    codeSnippet: `<TextInput\n  multiline={true}\n  numberOfLines={3}\n  textAlignVertical="top"\n  maxLength={300}\n  value={text}\n  onChangeText={setText}\n/>`,
    keyProps: ['multiline={true}', 'numberOfLines', 'textAlignVertical="top"', 'maxLength'],
  },
  readonly: {
    name: 'Read-Only Text Input',
    htmlTag: '<input readonly value="...">',
    reactNativeComponent: '<TextInput editable={false} selectTextOnFocus={true} />',
    purpose: 'Displays immutable form data that users can inspect and copy.',
    codeSnippet: `<TextInput\n  value="SYS-REF-2026-X8"\n  editable={false}\n  selectTextOnFocus={true}\n/>`,
    keyProps: ['editable={false}', 'selectTextOnFocus', 'value'],
  },
  disabled: {
    name: 'Disabled Form Control',
    htmlTag: '<input disabled value="...">',
    reactNativeComponent: '<TextInput editable={false} pointerEvents="none" />',
    purpose: 'Deactivates user interaction and prevents form submission of field.',
    codeSnippet: `<TextInput\n  value={val}\n  editable={false}\n  style={{ opacity: 0.5 }}\n/>`,
    keyProps: ['editable={false}', 'accessibilityState={{ disabled: true }}'],
  },
  date: {
    name: 'Date Picker',
    htmlTag: '<input type="date">',
    reactNativeComponent: 'Interactive Calendar Picker (<input type="date">)',
    purpose: 'Opens the system/browser calendar to choose any date.',
    codeSnippet: `<input type="date" value={dateVal} onChange={e => setDateVal(e.target.value)} />`,
    keyProps: ['type="date"', 'value', 'onChange', 'min', 'max'],
  },
  time: {
    name: 'Time Picker',
    htmlTag: '<input type="time">',
    reactNativeComponent: 'Interactive Time Picker (<input type="time">)',
    purpose: 'Opens the system/browser time picker to choose any hour, minute, AM/PM.',
    codeSnippet: `<input type="time" value={timeVal} onChange={e => setTimeVal(e.target.value)} />`,
    keyProps: ['type="time"', 'value', 'onChange'],
  },
  datetime: {
    name: 'Combined Date & Time Picker',
    htmlTag: '<input type="datetime-local">',
    reactNativeComponent: 'Interactive Datetime Picker (<input type="datetime-local">)',
    purpose: 'Opens the system date and time picker simultaneously.',
    codeSnippet: `<input type="datetime-local" value={dt} onChange={e => setDt(e.target.value)} />`,
    keyProps: ['type="datetime-local"', 'value', 'onChange'],
  },
  month: {
    name: 'Month-and-Year Picker',
    htmlTag: '<input type="month">',
    reactNativeComponent: 'Interactive Month Picker (<input type="month">)',
    purpose: 'Opens the system month selector without day selection.',
    codeSnippet: `<input type="month" value={month} onChange={e => setMonth(e.target.value)} />`,
    keyProps: ['type="month"', 'value', 'onChange'],
  },
  week: {
    name: 'Week-and-Year Picker',
    htmlTag: '<input type="week">',
    reactNativeComponent: 'Interactive Week Picker (<input type="week">)',
    purpose: 'Opens the system calendar week selector.',
    codeSnippet: `<input type="week" value={week} onChange={e => setWeek(e.target.value)} />`,
    keyProps: ['type="week"', 'value', 'onChange'],
  },
  select: {
    name: 'Dropdown Select with Optgroups',
    htmlTag: '<select><optgroup label="..."><option value="...">',
    reactNativeComponent: 'Grouped Selection Menu with Header Labels',
    purpose: 'Hierarchical single selection organized by category.',
    codeSnippet: `<Pressable onPress={() => setOpen(true)}>\n  <Text>{selectedOption}</Text>\n</Pressable>`,
    keyProps: ['options', 'optgroups', 'selectedValue'],
  },
  multiselect: {
    name: 'Multi-Select Dropdown',
    htmlTag: '<select multiple>',
    reactNativeComponent: 'Multi-Select Chip Selector with Checkboxes',
    purpose: 'Allows selecting multiple values from an organized list.',
    codeSnippet: `options.map(opt => (\n  <Pressable onPress={() => toggle(opt)}>\n    <Text>{opt} {isSelected && '✓'}</Text>\n  </Pressable>\n))`,
    keyProps: ['multiple={true}', 'selectedValues[]'],
  },
  radio: {
    name: 'Radio Button Group',
    htmlTag: '<input type="radio" name="tier">',
    reactNativeComponent: '<Pressable role="radio" /> Group',
    purpose: 'Mutually exclusive single choice among visible options.',
    codeSnippet: `options.map(opt => (\n  <Pressable role="radio" onPress={() => setValue(opt.id)}>\n    <View style={selected && styles.dot} />\n  </Pressable>\n))`,
    keyProps: ['role="radio"', 'accessibilityState={{ selected }}'],
  },
  segmented: {
    name: 'Segmented Control',
    htmlTag: '<div role="radiogroup" aria-label="Mode">',
    reactNativeComponent: 'Segmented Tab Pill Bar',
    purpose: 'Compact mode selection with active sliding pill.',
    codeSnippet: `segments.map(seg => (\n  <Pressable style={active === seg && styles.active} onPress={() => setActive(seg)}>\n    <Text>{seg}</Text>\n  </Pressable>\n))`,
    keyProps: ['values', 'selectedIndex', 'onChange'],
  },
  checkbox: {
    name: 'Single Checkbox',
    htmlTag: '<input type="checkbox">',
    reactNativeComponent: '<Pressable role="checkbox" /> with Icon',
    purpose: 'Binary boolean confirmation, opt-in, or terms agreement.',
    codeSnippet: `<Pressable role="checkbox" onPress={() => setChecked(!checked)}>\n  <View style={checked ? styles.checked : styles.box} />\n</Pressable>`,
    keyProps: ['role="checkbox"', 'accessibilityState={{ checked }}'],
  },
  switch: {
    name: 'Toggle Switch',
    htmlTag: '<input type="checkbox" role="switch">',
    reactNativeComponent: '<Switch value={val} onValueChange={setVal} />',
    purpose: 'Instant setting activation or preference toggle.',
    codeSnippet: `<Switch value={enabled} onValueChange={setEnabled} trackColor={{ false: '#CBD5E1', true: '#0A192F' }} thumbColor="#FFFFFF" />`,
    keyProps: ['value', 'onValueChange', 'trackColor', 'thumbColor'],
  },
  range: {
    name: 'Interactive Range Slider',
    htmlTag: '<input type="range" min="10" max="150" step="1">',
    reactNativeComponent: 'Smooth Touch/Drag Range Slider (<input type="range">)',
    purpose: 'Allows continuous sliding/dragging to pick any numerical value.',
    codeSnippet: `<input type="range" min="10" max="150" value={val} onChange={e => setVal(Number(e.target.value))} />`,
    keyProps: ['type="range"', 'min="10"', 'max="150"', 'step="1"', 'value'],
  },
  output: {
    name: 'Calculated Output Display',
    htmlTag: '<output for="budget team">',
    reactNativeComponent: '<Text> with Dynamically Derived State',
    purpose: 'Live computation dynamically computed from other inputs.',
    codeSnippet: `const cost = Math.round((budget * 1000) / teamSize);\n<Text>\${cost} / specialist</Text>`,
    keyProps: ['derivedState', 'liveCalculation'],
  },
  progress: {
    name: 'Form Progress Bar',
    htmlTag: '<progress value="75" max="100">',
    reactNativeComponent: 'Animated Completion Bar (<View style={{ width: "%" }} />)',
    purpose: 'Displays completion progress and required fields remaining.',
    codeSnippet: `<View style={styles.track}><View style={{ width: percent + '%' }} /></View>`,
    keyProps: ['value', 'max', 'percentage'],
  },
  meter: {
    name: 'Capacity Meter',
    htmlTag: '<meter min="0" max="100" low="40" high="80">',
    reactNativeComponent: 'Measurement Gauge with Threshold Indicators',
    purpose: 'Visualizes a measurement within known thresholds.',
    codeSnippet: `<View style={styles.meter}><View style={[styles.bar, isOptimum && styles.optimum]} /></View>`,
    keyProps: ['min', 'max', 'low', 'high', 'optimum', 'value'],
  },
  rating: {
    name: 'Star Rating',
    htmlTag: '<input type="range" min="1" max="5"> with Star Icons',
    reactNativeComponent: 'Touch-Interactive Rating (1 to 5 Stars)',
    purpose: 'Priority or quality rating score.',
    codeSnippet: `[1, 2, 3, 4, 5].map(s => <Pressable onPress={() => setRating(s)}><Icon name="star" /></Pressable>)`,
    keyProps: ['rating', 'maxStars={5}', 'onRatingChange'],
  },
  color: {
    name: 'Interactive Color Picker',
    htmlTag: '<input type="color">',
    reactNativeComponent: 'Native OS Color Palette (<input type="color">)',
    purpose: 'Opens the native OS color wheel/picker to choose any color.',
    codeSnippet: `<input type="color" value={color} onChange={e => setColor(e.target.value)} />`,
    keyProps: ['type="color"', 'value', 'onChange'],
  },
  tags: {
    name: 'Dynamic Tag Chips',
    htmlTag: '<input type="text"> with Removable Badges',
    reactNativeComponent: 'Chip Adder with Removable Badges',
    purpose: 'Dynamic metadata keyword collection with remove button.',
    codeSnippet: `tags.map(t => <View><Text>#{t}</Text><Pressable onPress={() => remove(t)}><Icon name="x" /></Pressable></View>)`,
    keyProps: ['tags', 'onAddTag', 'onRemoveTag'],
  },
  file: {
    name: 'Real File Upload Picker',
    htmlTag: '<input type="file" accept=".pdf,.doc,.docx,.txt,.zip">',
    reactNativeComponent: 'Native File Dialog (<input type="file">)',
    purpose: 'Opens device file browser to select any real file with size/name preview.',
    codeSnippet: `<input type="file" ref={inputRef} onChange={handleFile} />`,
    keyProps: ['type="file"', 'accept', 'onChange'],
  },
  imagePicker: {
    name: 'Real Photo / Image Picker',
    htmlTag: '<input type="file" accept="image/*">',
    reactNativeComponent: 'Native Photo Picker with Live Thumbnail Preview',
    purpose: 'Selects any image from device disk and renders real photo preview.',
    codeSnippet: `<input type="file" accept="image/*" onChange={handlePhoto} />`,
    keyProps: ['type="file"', 'accept="image/*"', 'onChange'],
  },
  signature: {
    name: 'Signature Input Pad',
    htmlTag: '<canvas> Signature Drawing Area',
    reactNativeComponent: 'Touch Drawing / Signature Pad with Clear Action',
    purpose: 'Captures user signature with touch gestures and clear button.',
    codeSnippet: `<View style={styles.signaturePad}>\n  <Text>{isSigned ? 'Signed ✓' : 'Sign Here'}</Text>\n  <Pressable onPress={clear}><Text>Clear</Text></Pressable>\n</View>`,
    keyProps: ['onSign', 'onClear', 'signatureData'],
  },
  hidden: {
    name: 'Hidden Form Data',
    htmlTag: '<input type="hidden" name="token" value="...">',
    reactNativeComponent: 'Internal React State / Non-visible Payload Object',
    purpose: 'Maintains internal tracking metadata (UUID, tokens, timestamps).',
    codeSnippet: `const [hiddenData] = useState({ sessionUuid, csrfToken, timestamp });`,
    keyProps: ['non-rendered state', 'payload injection'],
  },
  touchables: {
    name: 'React Native Touchables',
    htmlTag: '<button role="button">',
    reactNativeComponent: '<TouchableOpacity /> / <TouchableHighlight />',
    purpose: 'Standard mobile touch containers with opacity or highlight press feedback.',
    codeSnippet: `<TouchableOpacity activeOpacity={0.7} onPress={handlePress}>\n  <Text>Tap Action</Text>\n</TouchableOpacity>`,
    keyProps: ['activeOpacity', 'underlayColor', 'onPress', 'role="button"'],
  },
  button: {
    name: 'General-Purpose Action Button',
    htmlTag: '<button type="button">',
    reactNativeComponent: '<Pressable role="button" />',
    purpose: 'Triggers client-side validation or secondary script workflows.',
    codeSnippet: `<Pressable role="button" onPress={handleAction}><Text>Action</Text></Pressable>`,
    keyProps: ['role="button"', 'onPress'],
  },
  reset: {
    name: 'Reset Action Button',
    htmlTag: '<button type="reset">',
    reactNativeComponent: '<Pressable role="button" onPress={reset} />',
    purpose: 'Restores all form fields to default pristine state.',
    codeSnippet: `<Pressable role="button" onPress={reset}><Text>Reset</Text></Pressable>`,
    keyProps: ['role="button"', 'onPress={reset}'],
  },
  imageSubmit: {
    name: 'Image Submission Button',
    htmlTag: '<input type="image" src="..." alt="Submit">',
    reactNativeComponent: '<Pressable role="button"><Image ... /></Pressable>',
    purpose: 'Image-based submission button triggering form submit.',
    codeSnippet: `<Pressable role="button" onPress={submit}><Image source={badge} /></Pressable>`,
    keyProps: ['role="button"', 'onPress={submit}'],
  },
  submit: {
    name: 'Primary Submit Button',
    htmlTag: '<button type="submit">',
    reactNativeComponent: '<Pressable role="button" onPress={handleSubmit} />',
    purpose: 'Validates all fields, logs payload to console, and shows modal.',
    codeSnippet: `<Pressable role="button" onPress={submit}><Text>SUBMIT ALL DETAILS</Text></Pressable>`,
    keyProps: ['role="button"', 'onPress={submit}', 'disabled={isSubmitting}'],
  },
};

// Selection options
const CATEGORY_GROUPS = [
  {
    group: 'Engineering Practice',
    options: ['Mobile Architecture', 'Cloud Infrastructure', 'Cybersecurity & IAM'],
  },
  {
    group: 'Design & Analytics',
    options: ['UI/UX Systems', 'Machine Learning & AI', 'Enterprise Analytics'],
  },
];

const MULTI_SKILLS_LIST = [
  'React Native & Expo',
  'TypeScript & Strict Typing',
  'Node.js & GraphQL',
  'Docker & Cloud CI/CD',
];

const RADIO_OPTIONS = [
  { id: 'starter', label: 'Starter Tier' },
  { id: 'growth', label: 'Growth Tier' },
  { id: 'enterprise', label: 'Enterprise Tier' },
];

const SEGMENTED_OPTIONS = ['Remote', 'Hybrid', 'On-Site'];

const DATALIST_SUGGESTIONS = [
  'React Native & Expo',
  'Next.js & React 19',
  'TypeScript & Node',
  'Flutter & Dart',
  'SwiftUI & iOS Native',
];

export default function SinglePageFormApp() {
  const insets = useSafeAreaInsets();

  // Hidden file inputs for real device file & photo uploads
  const fileInputRef = useRef<any>(null);
  const photoInputRef = useRef<any>(null);

  // =========================================================================
  // FORM CONTROLS STATE (FULLY INTERACTIVE)
  // =========================================================================
  const [textVal, setTextVal] = useState('');
  const [emailVal, setEmailVal] = useState('');
  const [passwordVal, setPasswordVal] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['5', '8', '2', '4', '0', '1']);
  const [phoneCountry, setPhoneCountry] = useState('+1');
  const [phoneVal, setPhoneVal] = useState('');
  const [urlVal, setUrlVal] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [datalistVal, setDatalistVal] = useState('React Native & Expo');
  const [showDatalistDropdown, setShowDatalistDropdown] = useState(false);
  const [stepperVal, setStepperVal] = useState(4);
  const [textareaVal, setTextareaVal] = useState('');

  // Real Interactive Dates & Times (Default formatted ISO strings)
  const [dateVal, setDateVal] = useState('2026-11-20');
  const [timeVal, setTimeVal] = useState('14:30');
  const [datetimeVal, setDatetimeVal] = useState('2026-11-20T14:30');
  const [monthVal, setMonthVal] = useState('2026-11');
  const [weekVal, setWeekVal] = useState('2026-W47');

  // Selections
  const [selectedDiscipline, setSelectedDiscipline] = useState('Mobile Architecture');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [multiSelectSkills, setMultiSelectSkills] = useState<string[]>([
    'React Native & Expo',
    'TypeScript & Strict Typing',
  ]);
  const [selectedRadio, setSelectedRadio] = useState('growth');
  const [segmentVal, setSegmentVal] = useState(SEGMENTED_OPTIONS[0]);
  const [checkboxVal, setCheckboxVal] = useState(true);
  const [switchVal, setSwitchVal] = useState(true);

  // Real Interactive Range Slider (10 to 150)
  const [sliderVal, setSliderVal] = useState(65);

  // Real Interactive Color Picker (Hex)
  const [selectedColor, setSelectedColor] = useState('#0A192F');

  const [ratingVal, setRatingVal] = useState(5);
  const [tags, setTags] = useState<string[]>(['React-Native', 'Outfit', 'Navy-Blue']);
  const [newTagText, setNewTagText] = useState('');

  // Real Uploaded Files & Photos
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    size: string;
    type?: string;
  } | null>({
    name: 'architecture_specification.pdf',
    size: '3.6 MB',
    type: 'application/pdf',
  });

  const [attachedPhoto, setAttachedPhoto] = useState<{
    name: string;
    uri: string;
    size?: string;
  } | null>({
    name: 'engineer_badge.jpg',
    uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    size: '124.5 KB',
  });

  const [isSigned, setIsSigned] = useState(true);

  // Hidden State
  const [hiddenMeta] = useState({
    sessionUuid: 'UUID-9824-HORIZON',
    csrfToken: '0x8f2d4e19b01c3f7a',
    timestamp: '2026-10-14T12:00:00Z',
  });
  const [showHidden, setShowHidden] = useState(false);

  // Derived Calculations (<output>, <progress>, <meter>)
  const calculatedCost = useMemo(() => {
    return Math.round((sliderVal * 1000) / Math.max(1, stepperVal));
  }, [sliderVal, stepperVal]);

  const formProgress = useMemo(() => {
    let filled = 0;
    const totalRequired = 8;
    if (textVal.trim()) filled++;
    if (emailVal.trim()) filled++;
    if (passwordVal.length >= 6) filled++;
    if (phoneVal.trim()) filled++;
    if (urlVal.trim()) filled++;
    if (textareaVal.trim()) filled++;
    if (checkboxVal) filled++;
    if (attachedFile) filled++;
    return Math.round((filled / totalRequired) * 100);
  }, [textVal, emailVal, passwordVal, phoneVal, urlVal, textareaVal, checkboxVal, attachedFile]);

  const budgetMeterPercent = Math.min(100, Math.round((sliderVal / 150) * 100));

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inspectingCode, setInspectingCode] = useState<ElementCodeInfo | null>(null);
  const [submittedData, setSubmittedData] = useState<any | null>(null);
  const [modalViewTab, setModalViewTab] = useState<'formatted' | 'json'>('formatted');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const toastAnim = useRef(new Animated.Value(0)).current;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2500),
      Animated.timing(toastAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setToastMessage(null));
  };

  // Real File Upload handler
  const handleFileUpload = (e: any) => {
    const file = e.target?.files?.[0];
    if (file) {
      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
          : `${(file.size / 1024).toFixed(1)} KB`;
      setAttachedFile({
        name: file.name,
        size: sizeStr,
        type: file.type || 'Document',
      });
      showToast(`Selected file: ${file.name}`);
    }
  };

  // Real Photo Upload handler
  const handlePhotoUpload = (e: any) => {
    const file = e.target?.files?.[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      const sizeStr = `${(file.size / 1024).toFixed(1)} KB`;
      setAttachedPhoto({
        name: file.name,
        uri: blobUrl,
        size: sizeStr,
      });
      showToast(`Selected photo: ${file.name}`);
    }
  };

  const handleAddTag = () => {
    const clean = newTagText.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setNewTagText('');
    }
  };

  const toggleMultiSelect = (item: string) => {
    if (multiSelectSkills.includes(item)) {
      setMultiSelectSkills(multiSelectSkills.filter((s) => s !== item));
    } else {
      setMultiSelectSkills([...multiSelectSkills, item]);
    }
  };

  const handleAutofill = () => {
    setTextVal('Eleanor Vance');
    setEmailVal('eleanor.vance@horizon.io');
    setPasswordVal('Vance#Horizon2026!');
    setPhoneVal('555-839-2041');
    setUrlVal('https://horizon.io/engineering');
    setSearchVal('React Native Expo Architecture');
    setStepperVal(8);
    setTextareaVal(
      'World-class mobile architecture built with clean White canvas, bespoke Navy Blue contrast, Outfit typography, and precision 3px border radiuses.'
    );
    setDatalistVal('React Native & Expo');
    setOtpDigits(['9', '4', '1', '7', '8', '2']);
    setDateVal('2026-12-15');
    setTimeVal('15:30');
    setDatetimeVal('2026-12-15T15:30');
    setMonthVal('2026-12');
    setWeekVal('2026-W50');
    setSelectedDiscipline('Mobile Architecture');
    setMultiSelectSkills(['React Native & Expo', 'TypeScript & Strict Typing', 'Docker & Cloud CI/CD']);
    setSelectedRadio('growth');
    setCheckboxVal(true);
    setSwitchVal(true);
    setSliderVal(85);
    setSelectedColor('#1D4ED8');
    setRatingVal(5);
    setSegmentVal('Remote');
    setTags(['Precision-3px', 'Outfit', 'Navy-White']);
    setAttachedFile({ name: 'full_technical_blueprint_v4.pdf', size: '4.2 MB', type: 'application/pdf' });
    setAttachedPhoto({
      name: 'author_photo.jpg',
      uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      size: '180 KB',
    });
    setIsSigned(true);
    setErrors({});
    showToast('All elements autofilled!');
  };

  const handleReset = () => {
    setTextVal('');
    setEmailVal('');
    setPasswordVal('');
    setPhoneVal('');
    setUrlVal('');
    setSearchVal('');
    setStepperVal(1);
    setTextareaVal('');
    setDatalistVal(DATALIST_SUGGESTIONS[0]);
    setOtpDigits(['', '', '', '', '', '']);
    setDateVal('2026-11-20');
    setTimeVal('09:00');
    setDatetimeVal('2026-11-20T09:00');
    setMonthVal('2026-11');
    setWeekVal('2026-W47');
    setSelectedDiscipline(CATEGORY_GROUPS[0].options[0]);
    setMultiSelectSkills([]);
    setSelectedRadio('starter');
    setCheckboxVal(false);
    setSwitchVal(false);
    setSliderVal(50);
    setSelectedColor('#0A192F');
    setRatingVal(3);
    setSegmentVal(SEGMENTED_OPTIONS[0]);
    setTags([]);
    setAttachedFile(null);
    setAttachedPhoto(null);
    setIsSigned(false);
    setErrors({});
    showToast('Form reset to blank state.');
  };

  const handleSubmit = () => {
    if (isSubmitting) return;

    const errs: { [key: string]: string } = {};
    if (!textVal.trim()) errs.text = 'Full Name is required.';
    if (!emailVal.trim()) errs.email = 'Email address is required.';
    else if (!/^\S+@\S+\.\S+$/.test(emailVal.trim())) errs.email = 'Enter a valid email address.';
    if (!passwordVal || passwordVal.length < 6) errs.password = 'Min 6 characters required.';
    if (!phoneVal.trim()) errs.phone = 'Phone number is required.';
    if (!urlVal.trim()) errs.url = 'Valid URL required.';
    if (!textareaVal.trim()) errs.textarea = 'Notes are required.';
    if (!checkboxVal) errs.checkbox = 'Protocol agreement required.';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast('Please fix highlighted errors.');
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const payload = {
        meta: {
          timestamp: new Date().toISOString(),
          formattedTime: new Date().toLocaleString(),
          palette: 'White Base (#FFFFFF) with Navy Blue (#0A192F)',
          font: 'Outfit',
          borderRadius: '3px',
        },
        formControls: {
          '01_textInput': textVal.trim(),
          '02_emailInput': emailVal.trim(),
          '03_passwordInput': '••••••••' + passwordVal.slice(-2),
          '04_otpVerificationCode': otpDigits.join(''),
          '05_phoneInput': `${phoneCountry} ${phoneVal.trim()}`,
          '06_urlInput': urlVal.trim(),
          '07_searchInput': searchVal.trim() || 'None',
          '08_datalistAutocomplete': datalistVal,
          '09_numericStepper': stepperVal,
          '10_multilineTextarea': textareaVal.trim(),
          '11_readOnlyInput': 'SYS-REF-2026-X8',
          '12_datePicker': dateVal,
          '13_timePicker': timeVal,
          '14_datetimeLocal': datetimeVal,
          '15_monthPicker': monthVal,
          '16_weekPicker': weekVal,
          '17_selectOptgroups': selectedDiscipline,
          '18_multiSelectSkills': multiSelectSkills,
          '19_radioButtonGroup': selectedRadio,
          '20_segmentedControl': segmentVal,
          '21_singleCheckbox': checkboxVal ? 'Accepted' : 'Declined',
          '22_toggleSwitch': switchVal ? 'Enabled' : 'Disabled',
          '23_rangeSlider': `$${sliderVal},000 USD (${budgetMeterPercent}%)`,
          '24_calculatedOutput': `$${calculatedCost} USD / month / specialist`,
          '25_capacityMeter': `${budgetMeterPercent}%`,
          '26_colorPicker': selectedColor,
          '27_starRating': `${ratingVal} / 5 Stars`,
          '28_tagChips': tags,
          '29_fileUpload': attachedFile ? `${attachedFile.name} (${attachedFile.size})` : 'None',
          '30_photoImagePicker': attachedPhoto ? `${attachedPhoto.name} (${attachedPhoto.size || 'image'})` : 'None',
          '31_signaturePad': isSigned ? 'Digitally Signed ✓' : 'Unsigned',
          '32_hiddenMeta': hiddenMeta,
        },
      };

      console.log(`
╔════════════════════════════════════════════════════════════════════════════════╗
║                   📋 ALL FORM ELEMENTS SUBMISSION RECEIVED                     ║
║                   Timestamp: ${new Date().toLocaleString()}                    ║
╠════════════════════════════════════════════════════════════════════════════════╣
  [01] Text Input (Name)      : ${textVal.trim()}
  [02] Email Input            : ${emailVal.trim()}
  [03] Password Input         : •••••••• (${passwordVal.length} chars)
  [04] OTP 6-Digit Code       : ${otpDigits.join('')}
  [05] Telephone Input        : ${phoneCountry} ${phoneVal.trim()}
  [06] Website URL Input      : ${urlVal.trim()}
  [07] Search Input           : ${searchVal.trim() || 'None'}
  [08] Datalist Autocomplete  : ${datalistVal}
  [09] Number Stepper         : ${stepperVal} specialists
  [10] Multiline Textarea     : "${textareaVal.trim().slice(0, 50)}..."
  [11] Read-Only Field        : SYS-REF-2026-X8
  [12] Date Picker            : ${dateVal}
  [13] Time Picker            : ${timeVal}
  [14] Datetime-Local         : ${datetimeVal}
  [15] Month-and-Year         : ${monthVal}
  [16] Week-and-Year          : ${weekVal}
  [17] Select Dropdown        : ${selectedDiscipline}
  [18] Multi-Select Skills    : [${multiSelectSkills.join(', ')}]
  [19] Radio Button Group     : ${selectedRadio} tier
  [20] Segmented Control      : ${segmentVal}
  [21] Single Checkbox        : ${checkboxVal ? 'Accepted [✓]' : 'Declined [✗]'}
  [22] Toggle Switch          : ${switchVal ? 'Enabled [ON]' : 'Disabled [OFF]'}
  [23] Range Slider           : $${sliderVal},000 USD
  [24] <output> Calculated    : $${calculatedCost} / specialist
  [25] <meter> Capacity Load  : ${budgetMeterPercent}%
  [26] Color Picker           : ${selectedColor}
  [27] Star Rating            : ${'★'.repeat(ratingVal)}${'☆'.repeat(5 - ratingVal)} (${ratingVal}/5)
  [28] Tag Input Chips        : [${tags.map((t) => '#' + t).join(', ')}]
  [29] File Attachment        : ${attachedFile ? attachedFile.name : 'No file'}
  [30] Photo Image Picker     : ${attachedPhoto ? attachedPhoto.name : 'No photo'}
  [31] Signature Pad          : ${isSigned ? 'Digitally Signed ✓' : 'Unsigned'}
  [32] Hidden Form Metadata   : ${hiddenMeta.sessionUuid}
╠════════════════════════════════════════════════════════════════════════════════╣
║ RAW JSON PAYLOAD:                                                              ║
${JSON.stringify(payload, null, 2)}
╚════════════════════════════════════════════════════════════════════════════════╝
`);

      setSubmittedData(payload);
      showToast('Submitted! Full payload logged to console.');
    }, 350);
  };

  const CodeBtn = ({ id }: { id: string }) => (
    <Pressable
      onPress={() => setInspectingCode(ELEMENT_CODE_INFO[id])}
      style={styles.codePillBtn}
      accessibilityRole="button">
      <Feather name="code" size={11} color={NavyPalette.navyDeep} />
      <Text style={styles.codePillText}>Code</Text>
    </Pressable>
  );

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {toastMessage && (
        <Animated.View
          style={[
            styles.toastBox,
            { opacity: toastAnim, top: Platform.OS === 'web' ? 16 : insets.top + 8 },
          ]}>
          <Feather name="check-circle" size={15} color={NavyPalette.baseWhite} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}

      {/* Hidden Web File & Photo Inputs for Real File System Access */}
      {Platform.OS === 'web' && (
        <>
          {React.createElement('input', {
            ref: fileInputRef,
            type: 'file',
            style: { display: 'none' },
            onChange: handleFileUpload,
          })}
          {React.createElement('input', {
            ref: photoInputRef,
            type: 'file',
            accept: 'image/*',
            style: { display: 'none' },
            onChange: handlePhotoUpload,
          })}
        </>
      )}

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.two,
            paddingBottom: insets.bottom + Spacing.five,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <SafeAreaView edges={['left', 'right']} style={styles.safeContainer}>
          {/* ================================================================= */}
          {/* SMALL CLEAN HEADER & COMPACT ACTIONS (NO TABS, PURE FORM FLOW)   */}
          {/* ================================================================= */}
          <View style={styles.compactHeaderCard}>
            <View style={styles.headerTopRow}>
              <View style={styles.titleWrap}>
                <Text style={styles.smallCleanTitle}>Form Elements</Text>
                <Text style={styles.microSubtitle}>
                  Standard HTML & React Native controls • White canvas • 3px radius
                </Text>
              </View>

              <View style={styles.compactToolbar}>
                <Pressable onPress={handleAutofill} style={styles.btnSmallNavy}>
                  <Ionicons name="flash" size={11} color={NavyPalette.baseWhite} />
                  <Text style={styles.btnSmallNavyText}>Autofill</Text>
                </Pressable>
                <Pressable onPress={handleReset} style={styles.btnSmallOutline}>
                  <Feather name="rotate-ccw" size={11} color={NavyPalette.textNavy} />
                  <Text style={styles.btnSmallOutlineText}>Reset</Text>
                </Pressable>
              </View>
            </View>

            {/* Micro Progress Bar */}
            <View style={styles.microProgressRow}>
              <View style={styles.microProgressTrack}>
                <View style={[styles.microProgressFill, { width: `${formProgress}%` }]} />
              </View>
              <Text style={styles.microProgressText}>{formProgress}% Complete</Text>
            </View>
          </View>

          {/* ================================================================= */}
          {/* SECTION 1: TEXT, AUTH & IDENTITY CONTROLS                         */}
          {/* ================================================================= */}
          <View style={styles.fieldsetCard}>
            <Text style={styles.fieldsetSmallHeading}>Text, Auth & Search Controls</Text>

            {/* Paired Row 1: Name + Email */}
            <View style={styles.pairedRow}>
              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Name <Text style={styles.star}>*</Text></Text>
                  <CodeBtn id="text" />
                </View>
                <View style={[styles.compactInputBox, errors.text ? styles.inputError : null]}>
                  <Feather name="user" size={14} color={NavyPalette.textNavy} />
                  <TextInput
                    style={styles.compactTextInput}
                    placeholder="Eleanor Vance"
                    placeholderTextColor={NavyPalette.textMuted}
                    value={textVal}
                    onChangeText={(t) => {
                      setTextVal(t);
                      if (errors.text) setErrors({ ...errors, text: '' });
                    }}
                  />
                </View>
                {errors.text ? <Text style={styles.errSm}>{errors.text}</Text> : null}
              </View>

              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Email <Text style={styles.star}>*</Text></Text>
                  <CodeBtn id="email" />
                </View>
                <View style={[styles.compactInputBox, errors.email ? styles.inputError : null]}>
                  <Feather name="mail" size={14} color={NavyPalette.textNavy} />
                  <TextInput
                    style={styles.compactTextInput}
                    placeholder="eleanor@horizon.io"
                    placeholderTextColor={NavyPalette.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={emailVal}
                    onChangeText={(t) => {
                      setEmailVal(t);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                  />
                </View>
                {errors.email ? <Text style={styles.errSm}>{errors.email}</Text> : null}
              </View>
            </View>

            {/* Paired Row 2: Password + 6-digit OTP */}
            <View style={styles.pairedRow}>
              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Password <Text style={styles.star}>*</Text></Text>
                  <CodeBtn id="password" />
                </View>
                <View style={[styles.compactInputBox, errors.password ? styles.inputError : null]}>
                  <Feather name="lock" size={14} color={NavyPalette.textNavy} />
                  <TextInput
                    style={styles.compactTextInput}
                    placeholder="Min 6 chars"
                    placeholderTextColor={NavyPalette.textMuted}
                    secureTextEntry={!showPassword}
                    value={passwordVal}
                    onChangeText={(t) => {
                      setPasswordVal(t);
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Feather name={showPassword ? 'eye-off' : 'eye'} size={14} color={NavyPalette.textSecondary} />
                  </Pressable>
                </View>
                {errors.password ? <Text style={styles.errSm}>{errors.password}</Text> : null}
              </View>

              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>6-Digit OTP</Text>
                  <CodeBtn id="otp" />
                </View>
                <View style={styles.otpCompactRow}>
                  {otpDigits.map((d, i) => (
                    <TextInput
                      key={i}
                      style={styles.otpMiniCell}
                      maxLength={1}
                      keyboardType="number-pad"
                      value={d}
                      onChangeText={(v) => {
                        const next = [...otpDigits];
                        next[i] = v.slice(-1);
                        setOtpDigits(next);
                      }}
                    />
                  ))}
                </View>
              </View>
            </View>

            {/* Paired Row 3: Phone + URL */}
            <View style={styles.pairedRow}>
              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Telephone <Text style={styles.star}>*</Text></Text>
                  <CodeBtn id="tel" />
                </View>
                <View style={[styles.compactInputBox, errors.phone ? styles.inputError : null]}>
                  <Text style={styles.flagText}>+1</Text>
                  <TextInput
                    style={styles.compactTextInput}
                    placeholder="555-019-2834"
                    placeholderTextColor={NavyPalette.textMuted}
                    keyboardType="phone-pad"
                    value={phoneVal}
                    onChangeText={(t) => {
                      setPhoneVal(t);
                      if (errors.phone) setErrors({ ...errors, phone: '' });
                    }}
                  />
                </View>
                {errors.phone ? <Text style={styles.errSm}>{errors.phone}</Text> : null}
              </View>

              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Website URL <Text style={styles.star}>*</Text></Text>
                  <CodeBtn id="url" />
                </View>
                <View style={[styles.compactInputBox, errors.url ? styles.inputError : null]}>
                  <Feather name="globe" size={14} color={NavyPalette.textNavy} />
                  <TextInput
                    style={styles.compactTextInput}
                    placeholder="https://horizon.io"
                    placeholderTextColor={NavyPalette.textMuted}
                    keyboardType="url"
                    autoCapitalize="none"
                    value={urlVal}
                    onChangeText={(t) => {
                      setUrlVal(t);
                      if (errors.url) setErrors({ ...errors, url: '' });
                    }}
                  />
                </View>
                {errors.url ? <Text style={styles.errSm}>{errors.url}</Text> : null}
              </View>
            </View>

            {/* Paired Row 4: Search + Datalist */}
            <View style={styles.pairedRow}>
              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Search Input</Text>
                  <CodeBtn id="search" />
                </View>
                <View style={styles.compactInputBox}>
                  <Feather name="search" size={14} color={NavyPalette.textNavy} />
                  <TextInput
                    style={styles.compactTextInput}
                    placeholder="Query..."
                    placeholderTextColor={NavyPalette.textMuted}
                    returnKeyType="search"
                    value={searchVal}
                    onChangeText={setSearchVal}
                  />
                  {searchVal.length > 0 && (
                    <Pressable onPress={() => setSearchVal('')}>
                      <Feather name="x-circle" size={13} color={NavyPalette.textMuted} />
                    </Pressable>
                  )}
                </View>
              </View>

              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>&lt;datalist&gt; Autocomplete</Text>
                  <CodeBtn id="datalist" />
                </View>
                <View style={styles.compactInputBox}>
                  <Feather name="list" size={14} color={NavyPalette.textNavy} />
                  <TextInput
                    style={styles.compactTextInput}
                    placeholder="Select / type..."
                    placeholderTextColor={NavyPalette.textMuted}
                    value={datalistVal}
                    onChangeText={setDatalistVal}
                    onFocus={() => setShowDatalistDropdown(true)}
                  />
                  <Pressable onPress={() => setShowDatalistDropdown(!showDatalistDropdown)}>
                    <Feather name="chevron-down" size={14} color={NavyPalette.textNavy} />
                  </Pressable>
                </View>
                {showDatalistDropdown && (
                  <View style={styles.dropdownMiniList}>
                    {DATALIST_SUGGESTIONS.map((item) => (
                      <Pressable
                        key={item}
                        onPress={() => {
                          setDatalistVal(item);
                          setShowDatalistDropdown(false);
                        }}
                        style={styles.dropdownMiniRow}>
                        <Text style={styles.dropdownMiniText}>{item}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Paired Row 5: Stepper + Textarea */}
            <View style={styles.pairedRow}>
              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Numeric Stepper</Text>
                  <CodeBtn id="number" />
                </View>
                <View style={styles.stepperCompact}>
                  <Pressable
                    onPress={() => setStepperVal(Math.max(1, stepperVal - 1))}
                    style={styles.stepperBtnSm}>
                    <Feather name="minus" size={14} color={NavyPalette.textNavy} />
                  </Pressable>
                  <View style={styles.stepperCenterSm}>
                    <Text style={styles.stepperNumSm}>{stepperVal}</Text>
                    <Text style={styles.stepperLabelSm}>ENGINEERS</Text>
                  </View>
                  <Pressable
                    onPress={() => setStepperVal(Math.min(50, stepperVal + 1))}
                    style={styles.stepperBtnSm}>
                    <Feather name="plus" size={14} color={NavyPalette.textNavy} />
                  </Pressable>
                </View>
              </View>

              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Multiline Textarea <Text style={styles.star}>*</Text></Text>
                  <CodeBtn id="textarea" />
                </View>
                <View style={[styles.textareaMiniBox, errors.textarea ? styles.inputError : null]}>
                  <TextInput
                    style={styles.textareaMiniInput}
                    placeholder="Project deliverables & scope..."
                    placeholderTextColor={NavyPalette.textMuted}
                    multiline
                    numberOfLines={2}
                    maxLength={300}
                    value={textareaVal}
                    onChangeText={(t) => {
                      setTextareaVal(t);
                      if (errors.textarea) setErrors({ ...errors, textarea: '' });
                    }}
                  />
                </View>
                {errors.textarea ? <Text style={styles.errSm}>{errors.textarea}</Text> : null}
              </View>
            </View>

            {/* Paired Row 6: Read-Only + Disabled Controls */}
            <View style={styles.pairedRow}>
              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Read-Only &lt;input readonly&gt;</Text>
                  <CodeBtn id="readonly" />
                </View>
                <View style={[styles.compactInputBox, styles.inputBoxReadOnly]}>
                  <Feather name="lock" size={13} color={NavyPalette.textSecondary} />
                  <TextInput
                    style={styles.compactTextInput}
                    value="SYS-REF-2026-X8"
                    editable={false}
                    selectTextOnFocus
                  />
                  <Text style={styles.badgeRo}>READ-ONLY</Text>
                </View>
              </View>

              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Disabled &lt;input disabled&gt;</Text>
                  <CodeBtn id="disabled" />
                </View>
                <View style={[styles.compactInputBox, styles.inputBoxDisabled]}>
                  <Feather name="slash" size={13} color={NavyPalette.textMuted} />
                  <TextInput
                    style={[styles.compactTextInput, { color: NavyPalette.textMuted }]}
                    value="System Managed (Inactive)"
                    editable={false}
                  />
                  <Text style={styles.badgeDisabled}>DISABLED</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ================================================================= */}
          {/* SECTION 2: DATES & TIMES (NATIVE INTERACTIVE PICKERS)             */}
          {/* ================================================================= */}
          <View style={styles.fieldsetCard}>
            <Text style={styles.fieldsetSmallHeading}>Date & Time Pickers</Text>

            {/* Interactive Date & Time Paired */}
            <View style={styles.pairedRow}>
              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Date Picker</Text>
                  <CodeBtn id="date" />
                </View>
                <View style={styles.compactInputBox}>
                  <Feather name="calendar" size={14} color={NavyPalette.textNavy} />
                  {Platform.OS === 'web' ? (
                    React.createElement('input', {
                      type: 'date',
                      value: dateVal,
                      onChange: (e: any) => setDateVal(e.target.value),
                      style: {
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'transparent',
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: 13,
                        color: NavyPalette.textNavy,
                        cursor: 'pointer',
                      },
                    })
                  ) : (
                    <TextInput
                      style={styles.compactTextInput}
                      value={dateVal}
                      onChangeText={setDateVal}
                      placeholder="YYYY-MM-DD"
                    />
                  )}
                </View>
              </View>

              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Time Picker</Text>
                  <CodeBtn id="time" />
                </View>
                <View style={styles.compactInputBox}>
                  <Feather name="clock" size={14} color={NavyPalette.textNavy} />
                  {Platform.OS === 'web' ? (
                    React.createElement('input', {
                      type: 'time',
                      value: timeVal,
                      onChange: (e: any) => setTimeVal(e.target.value),
                      style: {
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'transparent',
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: 13,
                        color: NavyPalette.textNavy,
                        cursor: 'pointer',
                      },
                    })
                  ) : (
                    <TextInput
                      style={styles.compactTextInput}
                      value={timeVal}
                      onChangeText={setTimeVal}
                      placeholder="HH:MM"
                    />
                  )}
                </View>
              </View>
            </View>

            {/* Interactive Datetime-Local + Month + Week (3-in-1 Compact Row) */}
            <View style={styles.threeWayRow}>
              <View style={styles.thirdField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>datetime-local</Text>
                  <CodeBtn id="datetime" />
                </View>
                <View style={styles.compactInputBox}>
                  {Platform.OS === 'web' ? (
                    React.createElement('input', {
                      type: 'datetime-local',
                      value: datetimeVal,
                      onChange: (e: any) => setDatetimeVal(e.target.value),
                      style: {
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'transparent',
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: 12,
                        color: NavyPalette.textNavy,
                        cursor: 'pointer',
                      },
                    })
                  ) : (
                    <Text style={styles.compactDisplayTxtSm}>{datetimeVal}</Text>
                  )}
                </View>
              </View>

              <View style={styles.thirdField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Month</Text>
                  <CodeBtn id="month" />
                </View>
                <View style={styles.compactInputBox}>
                  {Platform.OS === 'web' ? (
                    React.createElement('input', {
                      type: 'month',
                      value: monthVal,
                      onChange: (e: any) => setMonthVal(e.target.value),
                      style: {
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'transparent',
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: 12,
                        color: NavyPalette.textNavy,
                        cursor: 'pointer',
                      },
                    })
                  ) : (
                    <Text style={styles.compactDisplayTxtSm}>{monthVal}</Text>
                  )}
                </View>
              </View>

              <View style={styles.thirdField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Week</Text>
                  <CodeBtn id="week" />
                </View>
                <View style={styles.compactInputBox}>
                  {Platform.OS === 'web' ? (
                    React.createElement('input', {
                      type: 'week',
                      value: weekVal,
                      onChange: (e: any) => setWeekVal(e.target.value),
                      style: {
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'transparent',
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: 12,
                        color: NavyPalette.textNavy,
                        cursor: 'pointer',
                      },
                    })
                  ) : (
                    <Text style={styles.compactDisplayTxtSm}>{weekVal}</Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* ================================================================= */}
          {/* SECTION 3: CHOICES, MENUS & TOGGLES                               */}
          {/* ================================================================= */}
          <View style={styles.fieldsetCard}>
            <Text style={styles.fieldsetSmallHeading}>Choices, Menus & Booleans</Text>

            {/* Dropdown Select + Multi-Select */}
            <View style={styles.pairedRow}>
              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Single-Select (Optgroup)</Text>
                  <CodeBtn id="select" />
                </View>
                <Pressable
                  onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={styles.compactInputBox}>
                  <Text style={styles.compactDisplayTxt} numberOfLines={1}>
                    {selectedDiscipline}
                  </Text>
                  <Feather name="chevron-down" size={14} color={NavyPalette.textNavy} />
                </Pressable>
                {isDropdownOpen && (
                  <View style={styles.dropdownMiniList}>
                    {CATEGORY_GROUPS.map((grp) => (
                      <View key={grp.group}>
                        <Text style={styles.optgroupMiniTitle}>{grp.group}</Text>
                        {grp.options.map((opt) => (
                          <Pressable
                            key={opt}
                            onPress={() => {
                              setSelectedDiscipline(opt);
                              setIsDropdownOpen(false);
                            }}
                            style={styles.dropdownMiniRow}>
                            <Text style={styles.dropdownMiniText}>{opt}</Text>
                            {opt === selectedDiscipline && (
                              <Feather name="check" size={12} color={NavyPalette.navyDeep} />
                            )}
                          </Pressable>
                        ))}
                      </View>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Multi-Select ({multiSelectSkills.length})</Text>
                  <CodeBtn id="multiselect" />
                </View>
                <View style={styles.multiSelectPills}>
                  {MULTI_SKILLS_LIST.map((s) => {
                    const isChecked = multiSelectSkills.includes(s);
                    return (
                      <Pressable
                        key={s}
                        onPress={() => toggleMultiSelect(s)}
                        style={[styles.skillChip, isChecked && styles.skillChipActive]}>
                        <Text style={[styles.skillChipTxt, isChecked && styles.skillChipTxtActive]}>
                          {isChecked ? '✓ ' : ''}{s.split(' ')[0]}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Radio Group + Segmented Control */}
            <View style={styles.pairedRow}>
              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Radio Group</Text>
                  <CodeBtn id="radio" />
                </View>
                <View style={styles.radioPillGroup}>
                  {RADIO_OPTIONS.map((opt) => {
                    const isSel = opt.id === selectedRadio;
                    return (
                      <Pressable
                        key={opt.id}
                        onPress={() => setSelectedRadio(opt.id)}
                        style={[styles.radioCompactPill, isSel && styles.radioCompactPillActive]}>
                        <View style={styles.radioMiniDot}>
                          {isSel && <View style={styles.radioMiniDotActive} />}
                        </View>
                        <Text style={[styles.radioPillTxt, isSel && styles.radioPillTxtActive]}>
                          {opt.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Segmented Control</Text>
                  <CodeBtn id="segmented" />
                </View>
                <View style={styles.segmentedCompactWrap}>
                  {SEGMENTED_OPTIONS.map((seg) => {
                    const isSel = segmentVal === seg;
                    return (
                      <Pressable
                        key={seg}
                        onPress={() => setSegmentVal(seg)}
                        style={[styles.segmentBtnSm, isSel && styles.segmentBtnSmActive]}>
                        <Text style={[styles.segmentTxtSm, isSel && styles.segmentTxtSmActive]}>
                          {seg}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Checkbox + Switch (Side by Side in 1 Clean Card) */}
            <View style={styles.pairedRow}>
              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Checkbox <Text style={styles.star}>*</Text></Text>
                  <CodeBtn id="checkbox" />
                </View>
                <Pressable
                  onPress={() => {
                    setCheckboxVal(!checkboxVal);
                    if (errors.checkbox) setErrors({ ...errors, checkbox: '' });
                  }}
                  style={styles.checkboxCompactRow}>
                  <View style={[styles.checkboxSmBox, checkboxVal && styles.checkboxSmBoxActive]}>
                    {checkboxVal && <Feather name="check" size={11} color={NavyPalette.baseWhite} />}
                  </View>
                  <Text style={styles.checkboxCompactTxt}>Accept Master Protocol</Text>
                </Pressable>
                {errors.checkbox ? <Text style={styles.errSm}>{errors.checkbox}</Text> : null}
              </View>

              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Toggle Switch</Text>
                  <CodeBtn id="switch" />
                </View>
                <View style={styles.switchCompactRow}>
                  <Text style={styles.switchCompactTxt}>Push Notifications</Text>
                  <Switch
                    value={switchVal}
                    onValueChange={setSwitchVal}
                    trackColor={{ false: '#CBD5E1', true: NavyPalette.navyDeep }}
                    thumbColor={NavyPalette.baseWhite}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* ================================================================= */}
          {/* SECTION 4: SLIDERS, METRICS & LIVE CALCULATIONS                   */}
          {/* ================================================================= */}
          <View style={styles.fieldsetCard}>
            <Text style={styles.fieldsetSmallHeading}>Range, Output, Meter & Colors</Text>

            {/* Interactive Slider (Sliding) + Calculated <output> */}
            <View style={styles.pairedRow}>
              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Range Slider: ${sliderVal}k</Text>
                  <CodeBtn id="range" />
                </View>
                <View style={styles.sliderInteractiveRow}>
                  {Platform.OS === 'web' ? (
                    React.createElement('input', {
                      type: 'range',
                      min: '10',
                      max: '150',
                      step: '1',
                      value: sliderVal,
                      onChange: (e: any) => setSliderVal(Number(e.target.value)),
                      style: {
                        flex: 1,
                        accentColor: NavyPalette.navyDeep,
                        cursor: 'pointer',
                        height: 6,
                      },
                    })
                  ) : (
                    <View style={styles.sliderBarSmBg}>
                      <View style={[styles.sliderBarSmFill, { width: `${budgetMeterPercent}%` }]} />
                    </View>
                  )}
                  <View style={styles.sliderLiveBadge}>
                    <Text style={styles.sliderLiveBadgeTxt}>${sliderVal}k</Text>
                  </View>
                </View>
              </View>

              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>&lt;output&gt; Calculated</Text>
                  <CodeBtn id="output" />
                </View>
                <View style={styles.outputBoxSm}>
                  <Text style={styles.outputMiniFormula}>
                    (${sliderVal}k) ÷ ({stepperVal} engineers)
                  </Text>
                  <Text style={styles.outputMiniValue}>
                    ${calculatedCost.toLocaleString()} / mo / specialist
                  </Text>
                </View>
              </View>
            </View>

            {/* Meter + Star Rating + Interactive Color Picker */}
            <View style={styles.threeWayRow}>
              <View style={styles.thirdField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>&lt;meter&gt; Load</Text>
                  <CodeBtn id="meter" />
                </View>
                <View style={styles.meterBarSmBg}>
                  <View
                    style={[
                      styles.meterBarSmFill,
                      { width: `${budgetMeterPercent}%` },
                      budgetMeterPercent > 80 ? styles.meterHigh : styles.meterOpt,
                    ]}
                  />
                </View>
                <Text style={styles.meterMiniLabel}>{budgetMeterPercent}% Allocation</Text>
              </View>

              <View style={styles.thirdField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Star Rating</Text>
                  <CodeBtn id="rating" />
                </View>
                <View style={styles.starRowSm}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Pressable key={s} onPress={() => setRatingVal(s)}>
                      <Ionicons
                        name={s <= ratingVal ? 'star' : 'star-outline'}
                        size={18}
                        color={s <= ratingVal ? NavyPalette.navyDeep : NavyPalette.navyBorder}
                      />
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.thirdField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Color Picker</Text>
                  <CodeBtn id="color" />
                </View>
                <View style={styles.colorPickerInteractiveRow}>
                  {Platform.OS === 'web' ? (
                    React.createElement('input', {
                      type: 'color',
                      value: selectedColor,
                      onChange: (e: any) => setSelectedColor(e.target.value),
                      style: {
                        width: 28,
                        height: 28,
                        border: `1px solid ${NavyPalette.navyBorder}`,
                        borderRadius: '3px',
                        padding: 0,
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                      },
                    })
                  ) : (
                    <View style={[styles.colorMiniDot, { backgroundColor: selectedColor }]} />
                  )}
                  <TextInput
                    style={styles.colorHexInput}
                    value={selectedColor.toUpperCase()}
                    onChangeText={(t) => {
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(t)) setSelectedColor(t);
                    }}
                    maxLength={7}
                  />
                </View>
              </View>
            </View>

            {/* Dynamic Tag Chips */}
            <View style={styles.fullWidthField}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>Dynamic Tag Chips</Text>
                <CodeBtn id="tags" />
              </View>
              <View style={styles.tagInputSmRow}>
                <View style={[styles.compactInputBox, styles.flex1]}>
                  <Feather name="tag" size={13} color={NavyPalette.textNavy} />
                  <TextInput
                    style={styles.compactTextInput}
                    placeholder="Add tag..."
                    placeholderTextColor={NavyPalette.textMuted}
                    value={newTagText}
                    onChangeText={setNewTagText}
                    onSubmitEditing={handleAddTag}
                  />
                </View>
                <Pressable onPress={handleAddTag} style={styles.tagAddSmBtn}>
                  <Text style={styles.tagAddSmTxt}>Add</Text>
                </Pressable>
                <View style={styles.tagBadgesSmRow}>
                  {tags.map((t, idx) => (
                    <View key={idx} style={styles.tagBadgeSm}>
                      <Text style={styles.tagBadgeSmTxt}>#{t}</Text>
                      <Pressable onPress={() => setTags(tags.filter((_, i) => i !== idx))}>
                        <Feather name="x" size={11} color={NavyPalette.textNavy} />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* ================================================================= */}
          {/* SECTION 5: REAL MEDIA, SIGNATURE & ACTION CONTROLS                */}
          {/* ================================================================= */}
          <View style={styles.fieldsetCard}>
            <Text style={styles.fieldsetSmallHeading}>Media, Signature & Action Controls</Text>

            {/* Real File Upload + Real Photo Picker */}
            <View style={styles.pairedRow}>
              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>File Picker</Text>
                  <CodeBtn id="file" />
                </View>
                {attachedFile ? (
                  <View style={styles.fileMiniCard}>
                    <Feather name="file-text" size={16} color={NavyPalette.navyDeep} />
                    <View style={styles.flex1}>
                      <Text style={styles.fileMiniName} numberOfLines={1}>
                        {attachedFile.name}
                      </Text>
                      <Text style={styles.fileMiniMeta}>{attachedFile.size}</Text>
                    </View>
                    <Pressable
                      onPress={() => {
                        setAttachedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}>
                      <Feather name="trash-2" size={13} color={NavyPalette.error} />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable
                    onPress={() => fileInputRef.current?.click()}
                    style={styles.fileDropSm}>
                    <Feather name="upload" size={13} color={NavyPalette.textNavy} />
                    <Text style={styles.fileDropSmTxt}>Choose Document</Text>
                  </Pressable>
                )}
              </View>

              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Image Photo Picker</Text>
                  <CodeBtn id="imagePicker" />
                </View>
                {attachedPhoto ? (
                  <View style={styles.photoMiniCard}>
                    <Image
                      source={{ uri: attachedPhoto.uri }}
                      style={styles.photoThumbImg}
                      resizeMode="cover"
                    />
                    <View style={styles.flex1}>
                      <Text style={styles.fileMiniName} numberOfLines={1}>
                        {attachedPhoto.name}
                      </Text>
                      <Text style={styles.fileMiniMeta}>{attachedPhoto.size || 'Image'}</Text>
                    </View>
                    <Pressable
                      onPress={() => {
                        setAttachedPhoto(null);
                        if (photoInputRef.current) photoInputRef.current.value = '';
                      }}>
                      <Feather name="x" size={13} color={NavyPalette.error} />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable
                    onPress={() => photoInputRef.current?.click()}
                    style={styles.fileDropSm}>
                    <Feather name="camera" size={13} color={NavyPalette.textNavy} />
                    <Text style={styles.fileDropSmTxt}>Choose Photo</Text>
                  </Pressable>
                )}
              </View>
            </View>

            {/* Signature Input Pad + Hidden State Inspector */}
            <View style={styles.pairedRow}>
              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Signature Input Pad</Text>
                  <CodeBtn id="signature" />
                </View>
                <View style={styles.signaturePadBox}>
                  <View style={styles.sigCenter}>
                    <Text style={styles.sigTxt}>{isSigned ? 'Eleanor Vance ✓' : 'Tap to Sign'}</Text>
                  </View>
                  <Pressable
                    onPress={() => setIsSigned(!isSigned)}
                    style={styles.sigToggleBtn}>
                    <Text style={styles.sigToggleTxt}>{isSigned ? 'Clear' : 'Sign'}</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.halfField}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>&lt;input type="hidden"&gt;</Text>
                  <CodeBtn id="hidden" />
                </View>
                <Pressable
                  onPress={() => setShowHidden(!showHidden)}
                  style={styles.hiddenMiniBtn}>
                  <Feather name={showHidden ? 'eye-off' : 'eye'} size={13} color={NavyPalette.textNavy} />
                  <Text style={styles.hiddenMiniTxt}>
                    {showHidden ? 'Hide Meta' : 'Inspect Token'}
                  </Text>
                </Pressable>
                {showHidden && (
                  <Text style={styles.hiddenCodeTxt}>
                    {hiddenMeta.sessionUuid} • {hiddenMeta.csrfToken.slice(0, 8)}...
                  </Text>
                )}
              </View>
            </View>

            {/* React Native Touchables Row */}
            <View style={styles.touchablesContainer}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>React Native Touchables</Text>
                <CodeBtn id="touchables" />
              </View>
              <View style={styles.actionBtnRowSm}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => showToast('TouchableOpacity activated!')}
                  style={styles.touchableBtnSm}>
                  <Text style={styles.actionBtnSmTxt}>TouchableOpacity</Text>
                </TouchableOpacity>

                <TouchableHighlight
                  underlayColor="#E2E8F0"
                  onPress={() => showToast('TouchableHighlight activated!')}
                  style={styles.touchableBtnSm}>
                  <Text style={styles.actionBtnSmTxt}>TouchableHighlight</Text>
                </TouchableHighlight>
              </View>
            </View>

            {/* Secondary Action Buttons Row (<button type="button">, <input type="image">) */}
            <View style={styles.actionBtnRowSm}>
              <Pressable
                onPress={() => showToast('Button clicked: Action valid!')}
                style={styles.actionBtnSm}>
                <Feather name="check" size={13} color={NavyPalette.textNavy} />
                <Text style={styles.actionBtnSmTxt}>&lt;button type="button"&gt;</Text>
              </Pressable>

              <Pressable onPress={handleSubmit} style={styles.actionBtnSm}>
                <Ionicons name="image" size={13} color={NavyPalette.textNavy} />
                <Text style={styles.actionBtnSmTxt}>&lt;input type="image"&gt;</Text>
              </Pressable>

              <Pressable onPress={handleReset} style={styles.actionBtnSm}>
                <Feather name="rotate-ccw" size={13} color={NavyPalette.error} />
                <Text style={[styles.actionBtnSmTxt, { color: NavyPalette.error }]}>
                  &lt;button type="reset"&gt;
                </Text>
              </Pressable>
            </View>
          </View>

          {/* ================================================================= */}
          {/* PRIMARY SUBMISSION BUTTON (<button type="submit">)               */}
          {/* ================================================================= */}
          <View style={styles.submitSection}>
            <View style={styles.submitTopAffordance}>
              <CodeBtn id="submit" />
            </View>
            <Pressable
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={({ pressed }) => [
                styles.submitBtn,
                pressed && styles.btnPressed,
                isSubmitting && styles.submitBtnDisabled,
              ]}>
              {isSubmitting ? (
                <>
                  <ActivityIndicator size="small" color={NavyPalette.baseWhite} />
                  <Text style={styles.submitBtnText}>VALIDATING & SUBMITTING...</Text>
                </>
              ) : (
                <>
                  <Feather name="send" size={16} color={NavyPalette.baseWhite} />
                  <Text style={styles.submitBtnText}>SUBMIT ALL DETAILS</Text>
                </>
              )}
            </Pressable>
            <Text style={styles.submitFootnote}>
              Logs all fields to terminal & console and launches the formatted view modal.
            </Text>
          </View>
        </SafeAreaView>
      </ScrollView>

      {/* ===================================================================== */}
      {/* 1. STREAMLINED CODE INFO MODAL (CLEAN, NO VERBOSE TEXT WALLS)         */}
      {/* ===================================================================== */}
      <Modal
        visible={!!inspectingCode}
        transparent
        animationType="fade"
        onRequestClose={() => setInspectingCode(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.codeModalCard}>
            {inspectingCode && (
              <>
                <View style={styles.codeModalHeader}>
                  <View style={styles.modalBadgeSm}>
                    <Feather name="code" size={14} color={NavyPalette.baseWhite} />
                  </View>
                  <View style={styles.flex1}>
                    <Text style={styles.codeModalTitle}>{inspectingCode.name}</Text>
                    <Text style={styles.codeModalTag}>{inspectingCode.htmlTag}</Text>
                  </View>
                  <Pressable onPress={() => setInspectingCode(null)} style={styles.closeBtnSm}>
                    <Feather name="x" size={18} color={NavyPalette.textNavy} />
                  </Pressable>
                </View>

                <View style={styles.codeModalBody}>
                  <View style={styles.codeModalSection}>
                    <Text style={styles.codeModalSecTitle}>React Native Component</Text>
                    <Text style={styles.rnComponentBadge}>
                      {inspectingCode.reactNativeComponent}
                    </Text>
                  </View>

                  <View style={styles.codeModalSection}>
                    <Text style={styles.codeModalSecTitle}>Purpose</Text>
                    <Text style={styles.codeModalSecBody}>{inspectingCode.purpose}</Text>
                  </View>

                  <View style={styles.codeModalSection}>
                    <Text style={styles.codeModalSecTitle}>Implementation Snippet</Text>
                    <View style={styles.codeSnippetBlock}>
                      <Text style={styles.codeSnippetTxt}>{inspectingCode.codeSnippet}</Text>
                    </View>
                  </View>

                  <View style={styles.codeModalSection}>
                    <Text style={styles.codeModalSecTitle}>Key Props</Text>
                    <View style={styles.propsPillRow}>
                      {inspectingCode.keyProps.map((p, i) => (
                        <View key={i} style={styles.propPillSm}>
                          <Text style={styles.propPillSmTxt}>{p}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                <Pressable
                  onPress={() => setInspectingCode(null)}
                  style={styles.modalDismissSmBtn}>
                  <Text style={styles.modalDismissSmTxt}>Close</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ===================================================================== */}
      {/* 2. SUBMISSION DETAILS VIEW MODAL (ALL SUBMITTED DETAILS)              */}
      {/* ===================================================================== */}
      <Modal
        visible={!!submittedData}
        transparent
        animationType="slide"
        onRequestClose={() => setSubmittedData(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.viewModalCard}>
            <View style={styles.viewModalHeader}>
              <View style={styles.titleRowModal}>
                <View style={styles.modalBadgeSm}>
                  <Ionicons name="checkmark-done" size={16} color={NavyPalette.baseWhite} />
                </View>
                <View>
                  <Text style={styles.codeModalTitle}>Submission Details</Text>
                  <Text style={styles.microSubtitle}>Logged to terminal & browser console</Text>
                </View>
              </View>

              <View style={styles.modalTabGroup}>
                <Pressable
                  onPress={() => setModalViewTab('formatted')}
                  style={[styles.modalTabBtn, modalViewTab === 'formatted' && styles.modalTabBtnActive]}>
                  <Text style={[styles.modalTabBtnTxt, modalViewTab === 'formatted' && styles.modalTabBtnTxtActive]}>
                    Formatted
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setModalViewTab('json')}
                  style={[styles.modalTabBtn, modalViewTab === 'json' && styles.modalTabBtnActive]}>
                  <Text style={[styles.modalTabBtnTxt, modalViewTab === 'json' && styles.modalTabBtnTxtActive]}>
                    JSON Code
                  </Text>
                </Pressable>
              </View>
            </View>

            <ScrollView style={styles.viewModalScroll} showsVerticalScrollIndicator>
              {modalViewTab === 'formatted' && submittedData ? (
                <View style={styles.viewModalDataGrid}>
                  {Object.entries(submittedData.formControls).map(([k, v]) => (
                    <View key={k} style={styles.viewModalRow}>
                      <Text style={styles.viewModalKey}>{k.replace(/^\d+_/, '')}</Text>
                      <Text style={styles.viewModalVal}>
                        {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.jsonCodeBox}>
                  <Text style={styles.jsonCodeTxt}>
                    {submittedData ? JSON.stringify(submittedData, null, 2) : ''}
                  </Text>
                </View>
              )}
            </ScrollView>

            <Pressable
              onPress={() => {
                showToast('Confirmed in developer console!');
                setSubmittedData(null);
              }}
              style={styles.modalDismissSmBtn}>
              <Text style={styles.modalDismissSmTxt}>Close Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: NavyPalette.baseWhite,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
  },
  safeContainer: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
  },
  flex1: {
    flex: 1,
  },
  star: {
    color: NavyPalette.error,
  },
  errSm: {
    fontFamily: Fonts.medium,
    fontSize: 10,
    color: NavyPalette.error,
    marginTop: 2,
  },

  // Compact Header
  compactHeaderCard: {
    backgroundColor: NavyPalette.surfaceLight,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
    padding: Spacing.three,
    gap: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleWrap: {
    flex: 1,
  },
  smallCleanTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: NavyPalette.navyDeep,
  },
  microSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: NavyPalette.textSecondary,
    marginTop: 1,
  },
  compactToolbar: {
    flexDirection: 'row',
    gap: 6,
  },
  btnSmallNavy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: NavyPalette.navyDeep,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: BorderRadius, // Strict 3px
  },
  btnSmallNavyText: {
    fontFamily: Fonts.semiBold,
    fontSize: 11,
    color: NavyPalette.baseWhite,
  },
  btnSmallOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: NavyPalette.baseWhite,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: BorderRadius, // Strict 3px
  },
  btnSmallOutlineText: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: NavyPalette.textNavy,
  },
  microProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  microProgressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
    overflow: 'hidden',
  },
  microProgressFill: {
    height: '100%',
    backgroundColor: NavyPalette.navyDeep,
    borderRadius: BorderRadius, // Strict 3px
  },
  microProgressText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: NavyPalette.navyDeep,
    fontWeight: '700',
  },

  // Fieldset Cards & Grouping
  fieldsetCard: {
    backgroundColor: NavyPalette.baseWhite,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
    padding: Spacing.three,
    gap: Spacing.three,
  },
  fieldsetSmallHeading: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: NavyPalette.navyDeep,
    borderBottomWidth: 1,
    borderBottomColor: NavyPalette.navyBorderSubtle,
    paddingBottom: 4,
  },

  // Paired Layouts
  pairedRow: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 10,
  },
  halfField: {
    flex: 1,
    gap: 4,
  },
  threeWayRow: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 8,
  },
  thirdField: {
    flex: 1,
    gap: 4,
  },
  fullWidthField: {
    width: '100%',
    gap: 4,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    color: NavyPalette.textNavy,
  },
  codePillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: NavyPalette.surfaceLight,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  codePillText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: NavyPalette.navyDeep,
  },

  // Compact Input Elements
  compactInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NavyPalette.surfaceLight,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
    paddingHorizontal: 10,
    height: 38,
    gap: 8,
  },
  inputBoxReadOnly: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
  },
  inputBoxDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    opacity: 0.8,
  },
  badgeRo: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    color: NavyPalette.navyDeep,
    backgroundColor: NavyPalette.baseWhite,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: BorderRadius,
  },
  badgeDisabled: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    color: NavyPalette.textMuted,
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: BorderRadius,
  },
  compactTextInput: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: NavyPalette.textNavy,
    padding: 0,
  },
  compactDisplayTxt: {
    flex: 1,
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: NavyPalette.textNavy,
  },
  compactDisplayTxtSm: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: NavyPalette.textNavy,
  },
  inputError: {
    borderColor: NavyPalette.error,
  },
  flagText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: NavyPalette.textNavy,
  },

  // OTP Mini
  otpCompactRow: {
    flexDirection: 'row',
    gap: 4,
    width: '100%',
    justifyContent: 'space-between',
  },
  otpMiniCell: {
    flex: 1,
    minWidth: 0,
    maxWidth: 44,
    height: 38,
    backgroundColor: NavyPalette.surfaceLight,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
    textAlign: 'center',
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: NavyPalette.textNavy,
  },

  // Textarea Mini
  textareaMiniBox: {
    backgroundColor: NavyPalette.surfaceLight,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
    padding: 6,
    height: 52,
  },
  textareaMiniInput: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: NavyPalette.textNavy,
    textAlignVertical: 'top',
    padding: 0,
  },

  // Dropdown Mini
  dropdownMiniList: {
    backgroundColor: NavyPalette.baseWhite,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
    marginTop: 2,
    overflow: 'hidden',
  },
  dropdownMiniRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: NavyPalette.navyBorderSubtle,
  },
  dropdownMiniText: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: NavyPalette.textSecondary,
  },
  optgroupMiniTitle: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    color: NavyPalette.textNavy,
    backgroundColor: NavyPalette.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  // Multi-Select
  multiSelectPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  skillChip: {
    paddingVertical: 4,
    paddingHorizontal: 7,
    backgroundColor: NavyPalette.surfaceLight,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
  },
  skillChipActive: {
    backgroundColor: NavyPalette.navyDeep,
    borderColor: NavyPalette.navyDeep,
  },
  skillChipTxt: {
    fontFamily: Fonts.medium,
    fontSize: 10,
    color: NavyPalette.textSecondary,
  },
  skillChipTxtActive: {
    color: NavyPalette.baseWhite,
    fontFamily: Fonts.bold,
  },

  // Radio Mini
  radioPillGroup: {
    gap: 4,
  },
  radioCompactPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: NavyPalette.surfaceLight,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
  },
  radioCompactPillActive: {
    borderColor: NavyPalette.navyDeep,
    backgroundColor: NavyPalette.baseWhite,
  },
  radioMiniDot: {
    width: 14,
    height: 14,
    borderRadius: BorderRadius, // Strict 3px
    borderWidth: 1.5,
    borderColor: NavyPalette.navyDeep,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioMiniDotActive: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius, // Strict 3px
    backgroundColor: NavyPalette.navyDeep,
  },
  radioPillTxt: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: NavyPalette.textSecondary,
  },
  radioPillTxtActive: {
    fontFamily: Fonts.bold,
    color: NavyPalette.textNavy,
  },

  // Segmented Mini
  segmentedCompactWrap: {
    flexDirection: 'row',
    backgroundColor: NavyPalette.surfaceLight,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
    padding: 2,
  },
  segmentBtnSm: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: BorderRadius, // Strict 3px
  },
  segmentBtnSmActive: {
    backgroundColor: NavyPalette.baseWhite,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
  },
  segmentTxtSm: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: NavyPalette.textSecondary,
  },
  segmentTxtSmActive: {
    fontFamily: Fonts.bold,
    color: NavyPalette.navyDeep,
  },

  // Checkbox & Switch Mini
  checkboxCompactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 38,
  },
  checkboxSmBox: {
    width: 16,
    height: 16,
    borderRadius: BorderRadius, // Strict 3px
    borderWidth: 1.5,
    borderColor: NavyPalette.navyDeep,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSmBoxActive: {
    backgroundColor: NavyPalette.navyDeep,
  },
  checkboxCompactTxt: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: NavyPalette.textNavy,
  },
  switchCompactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 38,
  },
  switchCompactTxt: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: NavyPalette.textNavy,
  },

  // Stepper Mini
  stepperCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NavyPalette.surfaceLight,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
    height: 38,
    overflow: 'hidden',
  },
  stepperBtnSm: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: NavyPalette.baseWhite,
  },
  stepperCenterSm: {
    flex: 1,
    alignItems: 'center',
  },
  stepperNumSm: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: NavyPalette.textNavy,
  },
  stepperLabelSm: {
    fontFamily: Fonts.bold,
    fontSize: 7,
    color: NavyPalette.textSecondary,
  },

  // Slider Interactive
  sliderInteractiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 38,
  },
  sliderBarSmBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: BorderRadius,
    overflow: 'hidden',
  },
  sliderBarSmFill: {
    height: '100%',
    backgroundColor: NavyPalette.navyDeep,
  },
  sliderLiveBadge: {
    backgroundColor: NavyPalette.navyDeep,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: BorderRadius,
  },
  sliderLiveBadgeTxt: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: NavyPalette.baseWhite,
  },

  // Output Mini
  outputBoxSm: {
    backgroundColor: NavyPalette.surfaceLight,
    borderWidth: 1,
    borderColor: NavyPalette.navyDeep,
    borderRadius: BorderRadius, // Strict 3px
    padding: 6,
    height: 38,
    justifyContent: 'center',
  },
  outputMiniFormula: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    color: NavyPalette.textSecondary,
  },
  outputMiniValue: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: NavyPalette.navyDeep,
  },

  // Meter Mini
  meterBarSmBg: {
    height: 7,
    backgroundColor: NavyPalette.surfaceSubtle,
    borderRadius: BorderRadius, // Strict 3px
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    overflow: 'hidden',
    marginTop: 4,
  },
  meterBarSmFill: {
    height: '100%',
    borderRadius: BorderRadius, // Strict 3px
  },
  meterOpt: {
    backgroundColor: '#10B981',
  },
  meterHigh: {
    backgroundColor: '#EF4444',
  },
  meterMiniLabel: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    color: NavyPalette.textSecondary,
    marginTop: 2,
  },

  // Stars & Colors
  starRowSm: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
    height: 38,
  },
  colorPickerInteractiveRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    height: 38,
  },
  colorHexInput: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: NavyPalette.textNavy,
    backgroundColor: NavyPalette.surfaceLight,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius,
    paddingHorizontal: 6,
    height: 28,
    width: 72,
  },
  colorMiniDot: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius, // Strict 3px
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
  },

  // Tags Mini
  tagInputSmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagAddSmBtn: {
    backgroundColor: NavyPalette.navyDeep,
    paddingHorizontal: 10,
    height: 38,
    justifyContent: 'center',
    borderRadius: BorderRadius, // Strict 3px
  },
  tagAddSmTxt: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: NavyPalette.baseWhite,
  },
  tagBadgesSmRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    flex: 1,
  },
  tagBadgeSm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: NavyPalette.surfaceLight,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: BorderRadius, // Strict 3px
  },
  tagBadgeSmTxt: {
    fontFamily: Fonts.medium,
    fontSize: 10,
    color: NavyPalette.textNavy,
  },

  // File & Photo Real Uploads
  fileMiniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NavyPalette.surfaceLight,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
    paddingHorizontal: 8,
    height: 42,
    gap: 8,
  },
  fileMiniName: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: NavyPalette.textNavy,
  },
  fileMiniMeta: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    color: NavyPalette.textSecondary,
  },
  fileDropSm: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: NavyPalette.surfaceLight,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
    height: 42,
  },
  fileDropSmTxt: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: NavyPalette.textNavy,
  },
  photoMiniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NavyPalette.surfaceLight,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
    paddingHorizontal: 8,
    height: 42,
    gap: 8,
  },
  photoThumbImg: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
  },

  // Signature Mini
  signaturePadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NavyPalette.surfaceLight,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
    height: 38,
    paddingHorizontal: 8,
  },
  sigCenter: {
    flex: 1,
  },
  sigTxt: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: NavyPalette.textNavy,
  },
  sigToggleBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    backgroundColor: NavyPalette.baseWhite,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
  },
  sigToggleTxt: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    color: NavyPalette.textNavy,
  },

  // Hidden Mini
  hiddenMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: NavyPalette.surfaceLight,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
    height: 38,
    paddingHorizontal: 8,
  },
  hiddenMiniTxt: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: NavyPalette.textNavy,
  },
  hiddenCodeTxt: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    color: NavyPalette.textSecondary,
    marginTop: 2,
  },

  // Touchables & Action Buttons Row
  touchablesContainer: {
    gap: 4,
  },
  touchableBtnSm: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NavyPalette.surfaceLight,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
    paddingVertical: 8,
  },
  actionBtnRowSm: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtnSm: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: NavyPalette.surfaceLight,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
    paddingVertical: 8,
  },
  actionBtnSmTxt: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: NavyPalette.textNavy,
  },

  // Primary Submit
  submitSection: {
    gap: 6,
    alignItems: 'center',
  },
  submitTopAffordance: {
    alignSelf: 'flex-end',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: NavyPalette.navyDeep,
    paddingVertical: 14,
    borderRadius: BorderRadius, // Strict 3px
    width: '100%',
    shadowColor: '#0A192F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  submitBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: NavyPalette.baseWhite,
    letterSpacing: 0.6,
  },
  submitFootnote: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: NavyPalette.textSecondary,
    textAlign: 'center',
  },

  // Toast
  toastBox: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 99999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: NavyPalette.navyDeep,
    borderRadius: BorderRadius, // Strict 3px
    paddingVertical: 8,
    paddingHorizontal: 14,
    shadowColor: '#0A192F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  toastText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: NavyPalette.baseWhite,
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 25, 47, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.three,
  },
  codeModalCard: {
    width: '100%',
    maxWidth: 580,
    backgroundColor: NavyPalette.baseWhite,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
    padding: Spacing.three,
    gap: Spacing.two,
  },
  codeModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: NavyPalette.navyBorder,
    paddingBottom: 8,
  },
  modalBadgeSm: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius, // Strict 3px
    backgroundColor: NavyPalette.navyDeep,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeModalTitle: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: NavyPalette.textNavy,
  },
  codeModalTag: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: NavyPalette.navyAccentBright,
    fontWeight: '700',
  },
  closeBtnSm: {
    padding: 2,
  },
  codeModalBody: {
    gap: 8,
  },
  codeModalSection: {
    gap: 2,
  },
  codeModalSecTitle: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    color: NavyPalette.textNavy,
    textTransform: 'uppercase',
  },
  codeModalSecBody: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: NavyPalette.textSecondary,
    lineHeight: 16,
  },
  rnComponentBadge: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: NavyPalette.navyDeep,
    backgroundColor: NavyPalette.surfaceLight,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    padding: 4,
    borderRadius: BorderRadius, // Strict 3px
  },
  codeSnippetBlock: {
    backgroundColor: '#0A192F',
    borderRadius: BorderRadius, // Strict 3px
    padding: 8,
  },
  codeSnippetTxt: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: '#38BDF8',
    lineHeight: 15,
  },
  propsPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  propPillSm: {
    backgroundColor: NavyPalette.surfaceLight,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: BorderRadius, // Strict 3px
  },
  propPillSmTxt: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: NavyPalette.textNavy,
  },
  modalDismissSmBtn: {
    backgroundColor: NavyPalette.navyDeep,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: BorderRadius, // Strict 3px
    marginTop: 4,
  },
  modalDismissSmTxt: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: NavyPalette.baseWhite,
  },

  // View Modal
  viewModalCard: {
    width: '100%',
    maxWidth: 620,
    maxHeight: '85%',
    backgroundColor: NavyPalette.baseWhite,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
    padding: Spacing.three,
    gap: Spacing.two,
  },
  viewModalHeader: {
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: NavyPalette.navyBorder,
    paddingBottom: 8,
  },
  titleRowModal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTabGroup: {
    flexDirection: 'row',
    backgroundColor: NavyPalette.surfaceLight,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
    padding: 2,
  },
  modalTabBtn: {
    flex: 1,
    paddingVertical: 5,
    alignItems: 'center',
    borderRadius: BorderRadius, // Strict 3px
  },
  modalTabBtnActive: {
    backgroundColor: NavyPalette.navyDeep,
  },
  modalTabBtnTxt: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: NavyPalette.textSecondary,
  },
  modalTabBtnTxtActive: {
    fontFamily: Fonts.bold,
    color: NavyPalette.baseWhite,
  },
  viewModalScroll: {
    maxHeight: 340,
  },
  viewModalDataGrid: {
    gap: 4,
  },
  viewModalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: NavyPalette.surfaceLight,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
    paddingVertical: 5,
    paddingHorizontal: 8,
    gap: 8,
  },
  viewModalKey: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: NavyPalette.textNavy,
  },
  viewModalVal: {
    flex: 1,
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: NavyPalette.textSecondary,
    textAlign: 'right',
  },
  jsonCodeBox: {
    backgroundColor: NavyPalette.surfaceLight,
    borderWidth: 1,
    borderColor: NavyPalette.navyBorder,
    borderRadius: BorderRadius, // Strict 3px
    padding: 8,
  },
  jsonCodeTxt: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: NavyPalette.textNavy,
    lineHeight: 14,
  },
});
