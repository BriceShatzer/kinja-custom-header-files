/* @flow */

import {
	type CustomHeaderColor,
	type CustomHeaderImage
} from 'kinja-magma/models/CustomHeader';
import imageUrl from 'kinja-images';

const setHeaderBackgroundStyle = (background: CustomHeaderColor | CustomHeaderImage) => {
	const defaultStyle = 'background-color: #FFFFFF';
	if (background) {
		switch (background.type) {
			case 'color':
				return `background-color: ${background.value}`;
			case 'image':
				return `
					background: url(${imageUrl(background.id, 'WideSuperLargeAuto', background.format)});
					background-size: cover;
				`;
			default:
				return defaultStyle;
		}
	} else {
		return defaultStyle;
	}
};

export default setHeaderBackgroundStyle;