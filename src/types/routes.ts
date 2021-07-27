import { DrawerContentComponentProps, DrawerContentOptions } from '@react-navigation/drawer';

export type RootStackParamList = {
	Root: undefined;
};

export type DrawerContentProps = DrawerContentComponentProps<DrawerContentOptions>;

export type BottomTabParamList = {
	Feed: undefined;
	Messages: undefined;
	Notifications: undefined;
};

export type TabOneParamList = {
	TabOneScreen: undefined;
};

export type TabTwoParamList = {
	TabTwoScreen: undefined;
};

export type StackNavigatorParamlist = {
	FeedList: undefined;
	Details: {
		id: number;
		name: string;
		handle: string;
		date: string;
		content: string;
		image: string;
		avatar: string;
		comments: number;
		retweets: number;
		hearts: number;
	};
};
