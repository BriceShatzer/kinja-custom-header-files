/* @flow */

import * as React from 'react';
import CustomHeader from './custom-header';
import EnsureDefaultTheme from '../theme';
import { mount } from 'enzyme';
import imageUrl from 'kinja-images';
import {
	type CustomHeaderProps,
	type CustomHeaderPlainText
} from 'kinja-magma/models/CustomHeader';
import { createCategoryId, createStoryTypeId} from 'kinja-magma/models/Id';

const testImage = {
	type: 'image',
	format: 'jpg',
	id: 'xyoakbvy1yett1diaacw'
};
const testString: string = 'This is test text';
const testColor: string = '#00008B';
const testPlainText: CustomHeaderPlainText = {
	type: 'plainText',
	value: testString,
	color: testColor
};
const base_testJSON = {
	isEditMode: false,
	hasEditPermission: false,
	fetchCustomHeaderApiMethod: () => Promise.resolve(null)
};
const testJSON_categoryId: CustomHeaderProps = {
	...base_testJSON,
	customHeaderRenderProps: {
		categoryId: createCategoryId('123456'),
		content: {}
	}
};
const testJSON_storyTypeId: CustomHeaderProps = {
	...base_testJSON,
	customHeaderRenderProps: {
		storyTypeId: createStoryTypeId('123456'),
		content: {}
	}
};

const mountThemedCustomHeader = props => {
	return mount(
		<EnsureDefaultTheme>
			<CustomHeader {...props} />
		</EnsureDefaultTheme>
	);
};

describe('<CustomHeader/> rendering', () => {
	it('Renders with just primary text', () => {
		testJSON_categoryId.customHeaderRenderProps.content = {
			primary: testPlainText
		};
		testJSON_storyTypeId.customHeaderRenderProps.content = {
			primary: testPlainText
		};
		[testJSON_categoryId, testJSON_storyTypeId].forEach(json => {
			const wrapper = mountThemedCustomHeader(json);
			const primaryElement = wrapper.find('a');
			expect(primaryElement.length).toBe(1);
			expect(primaryElement.text() === testString);
			expect(primaryElement.props.textColor === testColor);
			// $FlowFixMe
			expect(primaryElement).toHaveStyleRule('color', testColor);
		});
	});
	it('Renders with just primary image', () => {
		testJSON_categoryId.customHeaderRenderProps.content = {
			primary: testImage
		};
		testJSON_storyTypeId.customHeaderRenderProps.content = {
			primary: testImage
		};
		[testJSON_categoryId, testJSON_storyTypeId].forEach(json => {
			const wrapper = mountThemedCustomHeader(json);
			expect(wrapper.find('a').length).toBe(1);
			expect(wrapper.find('img').length).toBe(1);
		});
	});
	it('Renders with just secondary', () => {
		testJSON_categoryId.customHeaderRenderProps.content = {
			secondary: testPlainText
		};
		testJSON_storyTypeId.customHeaderRenderProps.content = {
			secondary: testPlainText
		};
		[testJSON_categoryId, testJSON_storyTypeId].forEach(json => {
			const wrapper = mountThemedCustomHeader(json);
			const secondaryElement = wrapper.find('div div');
			// $FlowFixMe
			expect(secondaryElement).toHaveStyleRule('color', testColor);
			expect(secondaryElement.length).toBe(1);
			expect(secondaryElement.text() === testString);

		});
	});
	it('Renders with just tertiary', () => {
		const arrayOfLinks = [{
			text: 'First Link',
			url: 'http://link1.com',
			color: testColor
		},{
			text: 'Second Link',
			url: 'http://link2.com',
			color: testColor
		},{
			text: 'Third Link',
			url: 'http://link3.com',
			color: testColor
		},{
			text: 'Fourth Link',
			url: 'http://link4.com',
			color: testColor
		}];
		testJSON_categoryId.customHeaderRenderProps.content = {
			tertiary: {
				type: 'links',
				value: arrayOfLinks
			}
		};
		testJSON_storyTypeId.customHeaderRenderProps.content = {
			tertiary: {
				type: 'links',
				value: arrayOfLinks
			}
		};
		[testJSON_categoryId, testJSON_storyTypeId].forEach(json => {
			const wrapper = mountThemedCustomHeader(json);

			arrayOfLinks.forEach(linkObj=>{
				const el = wrapper.find(`a[href="${linkObj.url}"]`);
				expect(el.props.href  === linkObj.url);
				expect(el.props.color  === linkObj.color);
				// $FlowFixMe
				expect(el).toHaveStyleRule('color', testColor);
				expect(el.getDOMNode().innerText  === linkObj.text);
			});
		});
	});
	it('Renders with just background color', () => {
		testJSON_categoryId.customHeaderRenderProps.content = {
			background: {
				type: 'color',
				value: testColor
			}
		};
		testJSON_storyTypeId.customHeaderRenderProps.content = {
			background: {
				type: 'color',
				value: testColor
			}
		};
		[testJSON_categoryId, testJSON_storyTypeId].forEach(json => {
			const wrapper = mountThemedCustomHeader(json);
			const backgroundContainer = wrapper.find('.hydrated');
			expect(wrapper.exists());
			// $FlowFixMe
			expect(backgroundContainer).toHaveStyleRule('background-color', testColor);
		});
	});
	it('Renders with just background image', () => {
		testJSON_categoryId.customHeaderRenderProps.content = {
			background: testImage
		};
		testJSON_storyTypeId.customHeaderRenderProps.content = {
			background: testImage
		};
		[testJSON_categoryId, testJSON_storyTypeId].forEach(json => {
			const wrapper = mountThemedCustomHeader(json);
			const backgroundContainer = wrapper.find('.hydrated');
			expect(wrapper.exists());
			// $FlowFixMe
			expect(backgroundContainer).toHaveStyleRule('background',`url(${imageUrl(testImage.id, 'WideSuperLargeAuto', testImage.format)})`);
			// $FlowFixMe
			expect(backgroundContainer).toHaveStyleRule('background-size', 'cover');
		});
	});
});

describe('<CustomHeader /> edit mode rendering', ()=> {
	const editMode_testJSON_categoryId = {
		...testJSON_categoryId,
		isEditMode: true,
		hasEditPermission: true
	};
	const editMode_testJSON_storyTypeId = {
		...testJSON_storyTypeId,
		isEditMode: true,
		hasEditPermission: true
	};

	it('Renders background toolbar', () => {
		[editMode_testJSON_categoryId, editMode_testJSON_storyTypeId].forEach(json => {
			const wrapper = mountThemedCustomHeader(json);
			const toolbar = wrapper.find('.edit-toolbar-background');
			expect(toolbar.exists());
		});
	});

	it('Renders "Add Element" buttons ', () => {
		[editMode_testJSON_categoryId, editMode_testJSON_storyTypeId].forEach(json => {
			const wrapper = mountThemedCustomHeader(json);
			const buttons = wrapper.find('button');
			const AddDescriptionBtn = buttons.at(0);
			const AddLinksBtn = buttons.at(1);
			expect(AddDescriptionBtn.text()).toEqual('Add description');
			expect(AddLinksBtn.text()).toEqual('Add Links');
		});
	});
	it('Renders "Save" button', () => {
		[editMode_testJSON_categoryId, editMode_testJSON_storyTypeId].forEach(json => {
			const wrapper = mountThemedCustomHeader(json);
			const saveButton = wrapper.render().find('button[data-savebutton="true"]');
			expect(saveButton.length).toBe(1);
			expect(saveButton.text()).toEqual('Save');
		});
	});
	it('Renders "Cancel" button', () => {
		[editMode_testJSON_categoryId, editMode_testJSON_storyTypeId].forEach(json => {
			const wrapper = mountThemedCustomHeader(json);
			const cancelButton = wrapper.render().find('button[data-closebutton="true" ]');
			expect(cancelButton.length).toBe(1);
			expect(cancelButton.text()).toEqual('Cancel');
		});
	});
});