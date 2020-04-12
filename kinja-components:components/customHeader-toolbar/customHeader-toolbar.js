/* @flow */

import * as React from 'react';
import Button19 from '../button19';
import styled from 'styled-components';
import media from 'kinja-components/style-utils/media';
import { colors } from '../theme/themes';
import PinIcon from 'kinja-components/components/icon19/Pin';
import {type FetchCustomHeaderApiMethod} from 'kinja-magma/models/CustomHeader';

type OpenButtonProps = {
	onClick: (SyntheticEvent<HTMLButtonElement>) => mixed;
}

export const OpenButton = (props: OpenButtonProps) => (
	<Button19 data-openbutton={true}
		className='open'
		onClick={props.onClick}
		variant='tertiary'
		labelPosition='after'
		icon={<PinIcon/>}
		label='Edit Header'
	/>
);

const CloseButton = (props: { onClick: (event?: SyntheticEvent<HTMLButtonElement>) => mixed }) => (
	<Button19 data-closebutton={true}
		className='close'
		onClick={props.onClick}
		variant='tertiary'
		label='Cancel'
	/>
);

const SaveButton = (props: { onClick: () => mixed }) => (
	<Button19 data-savebutton={true}
		className='save'
		onClick={props.onClick}
		variant='primary'
		label="Save"
	/>
);

export const ToolbarWrapper = styled.span`
	float: left;
	display: flex;
	z-index: 100;
	position: absolute;
	left: 1rem;
	${media.mediumDown`
		display: none;
	`}
`;

export const CustomHeaderToolbarWrapper = styled(ToolbarWrapper)`
	bottom: ${({ isSmall }) => isSmall ? '34px' : '42px'};
	.close,
	.open {
		border: 1px solid ${colors.midgray};
		background-color: ${colors.white};
		&:hover {
			background-color: ${colors.lightgray};
		}
	}
	button + button {
		margin-left: 8px;
	}
`;

export const InitCustomHeaderEditor = styled(ToolbarWrapper)`
	display: flex;
	top: calc(${({ isSmall }) => isSmall ? '34px' : '42px'}*-2);
	
	button {
		background-color: ${colors.white};
		border: 1px solid ${colors.midgray};
		&.hide {
			display: none;
		}
	}
`;


type State = { isEditMode: boolean };
type Props = {
	isEditMode: boolean,
	toggleHandler: (event?: SyntheticEvent<HTMLButtonElement>)=> mixed,
	saveHandler?: ()=>FetchCustomHeaderApiMethod;
}

class CustomHeaderToolbar extends React.Component<Props,State> {
	constructor(props: Props) {
		super(props);
		this.state = { isEditMode: props.isEditMode };
	}
	render() {
		const { saveHandler = undefinedSaveHandler, toggleHandler } = this.props;
		const toggleFunction = (event?: SyntheticEvent<HTMLButtonElement>) => {
			toggleHandler(event);
			this.setState(prevState => ({
				isEditMode: !prevState.isEditMode
			}));
		};
		return (
			<CustomHeaderToolbarWrapper>
				{this.state.isEditMode ? (
					<React.Fragment>
						<SaveButton
							onClick={event=>saveHandler().then(()=>toggleFunction(event))}
						/>
						<CloseButton
							onClick={event=>toggleFunction(event)}
						/>
					</React.Fragment>
				) : (
					<OpenButton
						onClick={event=>toggleFunction(event)}
					/>
				)}
			</CustomHeaderToolbarWrapper>
		);
	}
}

function undefinedSaveHandler() {
	return Promise.resolve(()=>console.log('saveHandler not currently defined')); // eslint-disable-line no-console
}

export default CustomHeaderToolbar;
