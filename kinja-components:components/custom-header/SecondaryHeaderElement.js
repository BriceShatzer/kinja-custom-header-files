/* @flow */

import * as React from 'react';
import styled from 'styled-components';
import {headerElementWidth} from './custom-header';
import {
	type CustomHeaderPlainText
} from 'kinja-magma/models/CustomHeader';
import HeaderCustomDescription from '../header/header-custom-description';
import AddElementButton from './AddElementButton';
import {FloatingToolbar} from 'kinja-components/components/toolbar-floating';
import Close from 'kinja-components/components/icon19/Close';
import TextColorToolbarButton from './TextColorToolbarButton';

const Wrapper = styled.span`
	position: relative;
`;
const HeaderSecondaryElement = styled(HeaderCustomDescription)`
	${()=>headerElementWidth}
	color: ${props => (props.textColor ? props.textColor : props.theme.color.darksmoke)};
	display: flex;
	justify-content: center;
`;

const SecondaryHeader = ({secondaryElementValue, isEditMode, onNewSecondaryValue}: {
	secondaryElementValue: ?CustomHeaderPlainText,
	isEditMode: boolean,
	onNewSecondaryValue: (newValue: CustomHeaderPlainText) => void,
}) => {
	const editableDiv = React.createRef();
	const content = secondaryElementValue && secondaryElementValue.value;
	if (content) {
		const textColor = secondaryElementValue && secondaryElementValue.color || '';
		const ClearButton = () => {
			return (<a
				title={'Remove Secondary Text'}
				onClick={(e: SyntheticEvent<HTMLAnchorElement>) => {
					e.preventDefault();
					onNewSecondaryValue({
						type: 'plainText',
						value: '',
						color: textColor
					});
				}}><Close/></a>);
		};
		return (
			<Wrapper>
				<React.Fragment>
					<HeaderSecondaryElement
						textColor={textColor}
						className='secondaryElementText'
						ref={editableDiv}
						contentEditable={isEditMode}
						onBlur={e => {
							onNewSecondaryValue({
								type: 'plainText',
								value: e.currentTarget.textContent,
								color: textColor
							});
						}}
					>
						{content}
					</HeaderSecondaryElement>
					{isEditMode && <FloatingToolbar
						className={'edit-toolbar edit-toolbar-secondaryElement'}
						display={'block'}
						children={[
							TextColorToolbarButton({
								currentTextColor: textColor,
								onChangeFunction: newColor=>onNewSecondaryValue({
									type: 'plainText',
									value: editableDiv && editableDiv.current ? editableDiv.current.textContent : '',
									color: newColor
								})
							}),
							ClearButton()
						]}>
					</FloatingToolbar>}
				</React.Fragment>
			</Wrapper>
		);
	} else {
		return isEditMode ? (
			<HeaderSecondaryElement>
				<AddElementButton
					label='Add description'
					onClick={() => onNewSecondaryValue({
						type: 'plainText',
						value: 'click here to edit the description'
					})}
				/>
			</HeaderSecondaryElement>
		) : null;
	}
};

export default SecondaryHeader;
