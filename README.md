# FormKit — Complete Universal React Native Form Elements Reference

FormKit is a production-grade, single-page mobile and web reference application demonstrating **every standard HTML form element**, **all 22 HTML input types**, **native React Native components**, and **advanced mobile input patterns** built on a pure White canvas with precision 3px border radiuses, bespoke Navy Blue typography, and Outfit styling.

---

## 🌟 Features & Highlights

- **All 22 HTML Input Types**: `text`, `password`, `email`, `number`, `tel`, `url`, `search`, `date`, `time`, `datetime-local`, `month`, `week`, `checkbox`, `radio`, `file`, `hidden`, `color`, `range`, `submit`, `reset`, `button`, and `image`.
- **All Standard HTML Form Elements**: `<form>`, `<input>`, `<label>`, `<textarea>`, `<select>`, `<option>`, `<optgroup>`, `<button>`, `<fieldset>`, `<legend>`, `<datalist>`, `<output>`, `<progress>`, and `<meter>`.
- **React Native Core Form Components**: `TextInput`, `Pressable`, `Switch`, `TouchableOpacity`, `TouchableHighlight`, `Modal`, `KeyboardAvoidingView`, `ScrollView`, and `ActivityIndicator`.
- **Native Interactive Controls**:
  - **Time Picker**: Real browser/OS time selector allowing selection of any hour, minute, and AM/PM.
  - **Date Picker**: Real browser/OS calendar selector to pick any date.
  - **Range Slider**: Continuous drag-and-slide range selector with real-time derivation.
  - **Color Picker**: Native OS color palette with eyedropper, RGB wheel, and hex code text editor.
  - **Real File & Photo Upload**: Native OS file browser dialog with live file name, size metadata, and photo thumbnail previews.
  - **OTP 6-Digit Cells**: Discrete single-cell numeric inputs with auto-contained flexbox alignment.
  - **Numeric Stepper**: Touch-interactive quantity increments and decrements with min/max bounds.
  - **Dynamic Tags**: Tag chip adder with live removal badges.
  - **Digital Signature**: Touch drawing pad with clear and confirmation states.
- **Single Page Flow**: Pure seamless vertical scroll without tab bars or category filters.
- **Inspection Modal (`[Code]`)**: Each form control includes a dedicated code modal displaying its HTML Tag, React Native Component, Purpose, Implementation Snippet, and Key Props.
- **Validation & Submission State**:
  - Comprehensive field validation with inline error feedback.
  - Submitting state feedback powered by `ActivityIndicator`.
  - Double submission prevention.
  - Dual-tab submission modal (**Formatted Data** & **Raw JSON Code**).
  - Formatted ASCII table and JSON payload output logged to developer console.

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Development Server

```bash
npx expo start
```

Press `w` to open in your web browser, `a` for Android emulator, or `i` for iOS simulator.

### 3. Build for Production

```bash
npx expo export
```

---

## 🎨 Design System Specifications

| Token | Value |
| :--- | :--- |
| **Canvas Background** | Pure White (`#FFFFFF`) |
| **Surface Accent** | `#F8FAFC`, `#F1F5F9` |
| **Primary Navy** | `#0A192F` |
| **Secondary Navy** | `#1E293B`, `#334155` |
| **Border Color** | `#CBD5E1`, `#E2E8F0` |
| **Corner Radius** | Exactly `3px` (`BorderRadius = 3`) |
| **Typography** | Google Fonts **Outfit** (`@expo-google-fonts/outfit`) |

---

## 📂 Project Structure

```
my-app/
├── src/
│   ├── app/
│   │   ├── _layout.tsx      # Root Expo Router layout with Outfit font loading
│   │   └── index.tsx        # Single-page complete form elements reference
│   ├── constants/
│   │   └── theme.ts         # NavyPalette, 3px BorderRadius, and Typography tokens
│   └── global.css           # Global typography definitions
├── assets/                  # Icons, fonts, and splash assets
├── package.json             # Project dependencies and Expo scripts
└── tsconfig.json            # Strict TypeScript configuration
```

---

## 📄 License

MIT © [BYIRINGIRO Samuel](https://github.com/BYIRINGIRO-Samuel)
