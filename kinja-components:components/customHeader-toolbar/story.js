/* @flow */

import * as React from 'react';
import {
	storiesOf,
	withDocs
} from 'base-storybook';
import CustomHeaderToolbar from './customHeader-toolbar';
import README from './README.md';



type State = { isEditMode: boolean };
const testLoadCustomHeaderModule = () => Promise.resolve('Updates the customHeaderModule')
	.then(string => {
		return console.log(string);
	});

const testSaveToService = () => {
	console.log('Firing a POST to the appropriate endpoint');
	return Promise.resolve(null);
};

class ToolbarContainer extends React.Component<*, State> {
	constructor(props) {
		super(props);
		this.state = { isEditMode: false };
	}
	render() {
		return (
			<div style={{'position': 'relative'}}>
				<CustomHeaderToolbar
					toggleHandler= {testLoadCustomHeaderModule}
					saveHandler={testSaveToService}
					isEditMode={false}
				/>
			</div>
		);
	}
}

storiesOf('4. Components|Custom Header', module)
	.addDecorator(withDocs(README))
	.add('Custom Header Toolbar', () => (
		<ToolbarContainer />
	));
