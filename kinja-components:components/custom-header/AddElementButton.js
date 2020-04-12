/* @flow */

import * as React from 'react';
import Button19 from 'kinja-components/components/button19';
import Plus from 'kinja-components/components/icon19/Plus';

type AddElementProps = {
	onClick: (SyntheticEvent<HTMLButtonElement>) => void;
	label: string
}

const AddElementButton = (props: AddElementProps) => (
	<Button19
		className='addElementButton'
		icon={<Plus/>}
		label={props.label}
		labelPosition='after'
		onClick={props.onClick}
		variant='tertiary'
	/>
);

export default AddElementButton;