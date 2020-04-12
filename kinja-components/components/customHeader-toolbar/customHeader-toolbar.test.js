import * as React from 'react';
import { shallow } from 'enzyme';

import  CustomHeaderToolbar from './customHeader-toolbar';

describe('<CustomHeaderToolbar />', () => {
	it('should render one button in closed mode', () => {
		const wrapper = shallow(<CustomHeaderToolbar isEditMode={false} toggleHandler={() => {}} saveHandler={() => {}} />);
		expect(wrapper).toMatchSnapshot();
	});
	it('should render one button in edit mode', () => {
		const wrapper = shallow(<CustomHeaderToolbar isEditMode={true} toggleHandler={() => {}} saveHandler={() => {}} />);
		expect(wrapper).toMatchSnapshot();
	});
});
