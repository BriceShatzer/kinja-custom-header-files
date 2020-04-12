/* @flow */

import React, { Component} from 'react';
import {type CustomHeaderProps} from 'kinja-magma/models/CustomHeader';
import styled from 'styled-components';
import {
	storiesOf,
	withDocs,
	blogGroup,
	text,
	color,
	options,
	number,
	boolean
} from 'base-storybook';

import CustomHeader from './custom-header';
import { ToolbarWrapper } from '../customHeader-toolbar/customHeader-toolbar';
import Theme from '../theme';
import README from './README.md';

import { createCategoryId } from 'kinja-magma/models/Id';

storiesOf('4. Components|Custom Header', module)
	.addDecorator(withDocs(README))
	.addParameters({ options: {showPanel: true} })
	.add('Custom Header', () => {
		const editMode = boolean('User Has Edit Permission', false);
		const theme = blogGroup();

		const background = () => {
			const backgroundStyle = options(
				'Background Style',
				{Color: 'color',Image: 'image'},
				'color',
				{display: 'inline-radio'}
			);

			switch (backgroundStyle) {
				case 'color':
					return {
						type: 'color',
						value: color('Background Color', '#fff')
					};
				case 'image':
					return {
						type: 'image',
						format: 'jpg',
						id: 'xyoakbvy1yett1diaacw'
						// animated gif
						// 'id': 'v5ar2ickxvvvenj7tiab'
					};
				default:
					break;
			}
		};

		const primaryField = () => {
			const fieldStyle = options(
				'Primary Field Type',
				{plainText: 'plainText', Image: 'image'},
				'plainText',
				{display: 'inline-radio'}
			);

			switch (fieldStyle) {
				case 'plainText':
					return {
						type: 'plainText',
						value: text('Headline', 'This is a headline')
					};
				case 'image':
					return {
						type: 'image',
						format: 'jpg',
						id: 'qrpfzmyxc9etccmtvctc'
						// the salty waitress
						// id: 'vgsvrw1bvsn8zbzxabst'

					};
				default:
					break;
			}
		};
		const secondaryField = () => {
			return text('Description', 'This is a description');
		};
		const tertiaryField = () => {
			const linkCount = number('Link Count', 4, {
				range: true,
				min: 0,
				max: 4,
				step: 1
			});
			const linksArray = [{
				text: 'First Link',
				url: 'http://google.com',
				color: ''
			},{
				text: 'Second Link',
				url: 'http://google.com',
				color: ''
			},{
				text: 'Third Link',
				url: 'http://google.com',
				color: ''
			},{
				text: 'Fourth Link',
				url: 'http://google.com',
				color: ''
			}].slice(0, linkCount);

			return linksArray;
		};
		const CustomStyling = styled.div`
			${ToolbarWrapper} {
				display: none;
			}
		`;

		const hasCuration = boolean('Has curation?', false);

		const customHeaderTestJSON: CustomHeaderProps = {
			hasEditPermission: editMode,
			isEditMode: editMode,
			fetchCustomHeaderApiMethod: () => Promise.resolve(null),
			customHeaderRenderProps: {
				categoryId: createCategoryId('40'),
				content: {
					primary: primaryField(),
					secondary: {
						type: 'plainText',
						value: secondaryField()
					},
					tertiary: {
						type: 'links',
						value: tertiaryField()
					},
					background: background()
				}
			},
			hasCuration
		};
		type State = CustomHeaderProps;
		class Wrapper extends Component<CustomHeaderProps,State> {
			constructor(props: CustomHeaderProps) {
				super(props);
				this.state = {
					...props
				};
			}
			render() {
				return (
					<CustomStyling>
						<Theme blog={theme}>
							<CustomHeader {...this.state} />
						</Theme>
					</CustomStyling>
				);
			}
		}

		return (
			<Wrapper {...customHeaderTestJSON}/>
		);
	});
