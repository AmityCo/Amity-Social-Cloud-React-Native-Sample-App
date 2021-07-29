import { ColorSchemeName } from 'react-native-appearance';

export interface PreferencesContextInterface {
	theme: ColorSchemeName;
	toggleTheme: () => void;
}
