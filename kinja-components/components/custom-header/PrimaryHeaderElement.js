// @flow

import React from 'react';
import styled, { css } from 'styled-components';
import { darken } from 'polished';

import media from 'kinja-components/style-utils/media';
import { gridValue } from 'kinja-components/components/grid-utils';
import { type ImageUpdateMethod } from './custom-header';
import { imageFormatFromString } from 'postbody/Image';
import { LazyResponsiveImage } from '../elements/image';
import {FloatingToolbar} from 'kinja-components/components/toolbar-floating';
import TextColorToolbarButton from './TextColorToolbarButton';
import Image from 'kinja-components/components/icon19/Image';
import Editor from 'kinja-components/components/icon19/Editor';
import Link from 'kinja-components/components/elements/link';

import type { ComponentType } from 'react';
import type { BlogThemeName } from '../theme/theme';
import {
	type CustomHeaderPlainText,
	type CustomHeaderImage
} from 'kinja-magma/models/CustomHeader';


const blogTheme = (blog: BlogThemeName) => {
	switch (blog) {
		case 'theonion':
			return css`
				color: ${props => props.theme.color.black};
				text-transform: capitalize;
				font-weight: bold;
			`;
		case 'clickhole':
			return css`
				color: ${props => props.theme.color.black};
				text-transform: capitalize;
				font-style: italic;
			`;
		default:
			return;
	}
};

const SetRelativePosition = styled.span`
	position: relative;
	text-align: center;
	max-width: 1300px;

	.edit-toolbar-primaryElement {
		position: absolute;
		top: 2px; /* line-height - font-size || 38 - 40 */
		left: calc(100% - 48px);

		${media.largeUp`
			left: 100%;
			top: 8px;
		`}

		${media.xxlargeUp`
			left: calc(100% + 1rem);
		`}
	}
`;

const HeaderPrimary: ComponentType<{small?: boolean}> = styled(Link)`
	max-width: 100%;
	font-family: ${props => props.theme.typography.headline.fontFamily};
	color: ${props => props.theme.color.primary};
	font-weight: 800;
	text-transform: capitalize;
	text-align: center;

	${props => blogTheme(props.theme.blog)};

	&:hover {
		color: ${props => darken(0.1, props.theme.color.primary)};
		text-decoration: none;
	}

	${media.mediumDown`
		min-width: 100%;
		font-size: 38px;
		line-height: 40px;
	`}
	${media.largeOnly`
		min-width: ${gridValue.large('6c')};
	`}
	${media.xlargeOnly`
		min-width: ${gridValue.xlarge('6c')};
	`}
	${media.xxlargeUp`
		min-width: ${gridValue.xxlarge('6c')};
	`}

	${props => props.small ? `
		font-size: 24px;
		line-height: 32px;
	` : `
		font-size: 48px;
		line-height: 56px;
	`}

	${props => (props.textColor && `
		color:${props.textColor};
		&:focus, &:hover {
			color:${props.textColor};
		}
	`)}
	img {
		max-height: 56px;
	}

	${media.mediumDown`
		img {
			max-height: 40px;
		}
	`}
`;

const PrimaryHeaderElement = ({url, events, primaryElementValue, isEditMode, toggleImageModal, onNewPrimaryValue}: {
	url?: string,
	events?: ?(name: string) => Array<string>,
	primaryElementValue?: CustomHeaderPlainText | CustomHeaderImage,
	isEditMode: boolean,
    toggleImageModal: (imageUpdateMethod: ImageUpdateMethod) => void,
	onNewPrimaryValue: (newValue: CustomHeaderPlainText | CustomHeaderImage) => void
}) => {
	const plainTextValue = primaryElementValue && primaryElementValue.type === 'plainText' && primaryElementValue.value;
	const textColor = (primaryElementValue &&
		primaryElementValue.type === 'plainText' &&
		primaryElementValue.color) || '';
	const editableContainer = React.createRef();
	let elementType;
	let content;
	if (primaryElementValue) {
		if (plainTextValue) {
			elementType = 'text';
			content = (isEditMode ?
				<span
					contentEditable={'true'}
					ref={editableContainer}
					onBlur={(e: SyntheticFocusEvent<HTMLSpanElement>) => {
						onNewPrimaryValue({
							'type': 'plainText',
							'value': e.currentTarget.textContent,
							'color': textColor
						});
					}}>
					{plainTextValue}
				</span>
				: <span ref={editableContainer}>
					{plainTextValue}
				</span>
			);
		} else if (primaryElementValue.type === 'image') {
			elementType = 'image';
			// Quickfix to avoid rendering a video element when the image is gif
			const format = imageFormatFromString(primaryElementValue.format);
			content = (
				<LazyResponsiveImage
					id={primaryElementValue.id}
					format={format === 'gif' ? 'jpg' : format}
					noLazy
					relative
				/>
			);
		} else {
			content = null;
		}
	}
	const UsePlainTextButton = () => {
		return (
			<a
				title={'Use Text For Primary'}
				onClick={()=>onNewPrimaryValue({
					'type': 'plainText',
					'value': 'Click Here To Edit The Title',
					'color': textColor})}
			>
				<Editor />
			</a>
		);
	};
	const UseImageButton = () => {
		return (
			<a
				title={'Use Image For Primary'}
				onClick={(e: SyntheticEvent<HTMLAnchorElement>)=>{
					e.preventDefault();
					toggleImageModal(img=>onNewPrimaryValue(img));
				}}>
				<Image/>
			</a>);
	};

	if (content !== null) {
		const toolbarButtons = (plainTextValue) ?
			[TextColorToolbarButton({
				currentTextColor: textColor,
				onChangeFunction: newColor=>onNewPrimaryValue({
					type: 'plainText',
					value: editableContainer && editableContainer.current ? editableContainer.current.textContent : '',
					color: newColor
				})
			}), UseImageButton()] :
			[UseImageButton(), UsePlainTextButton()];
		return (
			<SetRelativePosition elementType={elementType}>
				<React.Fragment>
					<HeaderPrimary
						href={url}
						textColor={textColor}
						events={events ? events(plainTextValue || 'image') : []}>
						{content}
					</HeaderPrimary>
					{isEditMode && <FloatingToolbar
						className={'edit-toolbar edit-toolbar-primaryElement'}
						display={'block'}
						children={toolbarButtons}
					/>}
				</React.Fragment>
			</SetRelativePosition>
		);
	} else {
		return null;
	}
};

export default PrimaryHeaderElement;
