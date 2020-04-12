// @flow

import React from 'react';
import styled from 'styled-components';
import {FloatingToolbar} from 'kinja-components/components/toolbar-floating';
import ColorPicker from 'kinja-components/components/icon19/ColorPicker';
import Image from 'kinja-components/components/icon19/Image';
import Close from 'kinja-components/components/icon19/Close';
import {type ImageUpdateMethod} from './custom-header';
import {
	type CustomHeaderColor,
	type CustomHeaderImage
} from 'kinja-magma/models/CustomHeader';

const InputColor = styled.a`
	position: relative;
	& input {
		cursor: pointer;
		position: absolute;
		top: calc(50% - 5px);
	}
`;

const BackgroundToolbar = ({toggleImageModal, onNewBackgroundValue}: {
    toggleImageModal: (imageUpdateMethod: ImageUpdateMethod) => void,
    onNewBackgroundValue: (newValue: CustomHeaderColor | CustomHeaderImage) => void
}) => {
	const ColorPickerButton = () => {
		return (
			<InputColor title={'Use Color For Background'}>
				<React.Fragment>
					<ColorPicker/>
					<input
						type="color"
						onChange={(event: SyntheticEvent<HTMLInputElement>) => onNewBackgroundValue({'type': 'color','value': event.currentTarget.value})}
					/>
				</React.Fragment>
			</InputColor>
		);
	};

	const ImageButton = () => {
		return (
			<a
				title={'Use Image For Background'}
				onClick={(e: SyntheticEvent<HTMLAnchorElement>)=>{
					e.preventDefault();
					toggleImageModal(img=>onNewBackgroundValue(img));
				}}
			>
				<Image/>
			</a>
		);
	};

	const ResetButton = () => {
		return (
			<a
				title={'Remove Background'}
				onClick={(e: SyntheticEvent<HTMLAnchorElement>)=>{
					e.preventDefault();
					return onNewBackgroundValue({'type': 'color','value': '#FFFFFF'});
				}}
			><Close/></a>
		);
	};

	return (
		<FloatingToolbar
			className={'edit-toolbar edit-toolbar-background'}
			display={'block'}
			children={[ColorPickerButton(), ImageButton(), ResetButton()]}>
		</FloatingToolbar>
	);
};

export default BackgroundToolbar;