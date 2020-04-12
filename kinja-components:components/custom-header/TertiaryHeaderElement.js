/* @flow */

import * as React from 'react';
import styled from 'styled-components';
import {headerElementWidth} from './custom-header';
import { type CustomHeaderLinks } from 'kinja-magma/models/CustomHeader';
import AddElementButton from './AddElementButton';
import TextColorToolbarButton from './TextColorToolbarButton';
import {FloatingToolbar} from 'kinja-components/components/toolbar-floating';
import Close from 'kinja-components/components/icon19/Close';
import Pencil from 'kinja-components/components/icon19/Pencil';


const TertiaryElement = styled.div`
	margin-top: 16px;
	border-top: 1px solid ${props => (props.lineColor ? props.lineColor : props.theme.color.lightgray)};
	padding-top: 16px;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	position: relative;

	${()=>headerElementWidth}
`;

const Link = styled.a`
	padding-right: 8px;
	padding-left: 8px;
	line-height: 16px;
	font-weight: 700;
	text-transform: uppercase;
	font-size: 14px;
	text-align: center;

	color: ${props => (props.color ? props.color : props.theme.color.darksmoke)};

	&:hover,
	&:active {
		text-decoration: none;
		color: ${props => (props.color ? props.color : props.theme.color.primary)};
	}
`;

const TertiaryHeaderElement = ({tertiaryElementValue, textColor, isEditMode, toggleAddLinksModal, onNewTertiaryValue, setTertiaryTextColor}: {
	tertiaryElementValue: ?CustomHeaderLinks,
	textColor: ?string,
	isEditMode: boolean,
	toggleAddLinksModal: ()=>void,
	onNewTertiaryValue: (newHeaderContent: CustomHeaderLinks) => void,
	setTertiaryTextColor: (color: string) => void
}) => {
	const EditButton = () => {
		return (
			<a
				title={'Update Links'}
				onClick={(e: SyntheticEvent<HTMLAnchorElement>)=>{
					e.preventDefault();
					toggleAddLinksModal();
				}}
			>
				<Pencil/>
			</a>);
	};
	const ClearButton = () => {
		return (
			<a
				title={'Remove Links'}
				onClick={(e: SyntheticEvent<HTMLAnchorElement>)=>{
					e.preventDefault();
					const newValue = {
						type: 'links',
						value: []
					};
					onNewTertiaryValue(newValue);
				}}
			><Close/></a>);
	};

	const tert = tertiaryElementValue;
	if (tert && tert.value && tert.value.length > 0) {
		const arr: Array<{ text: string, url: string, color: string }> = tert.value;
		const Elements: Array<Link> = arr.map<React.Node>(({text, url}) => (
			<Link color={textColor} href={url} key={url + text}>{text}</Link>
		));

		return (
			<TertiaryElement lineColor={textColor}>
				{Elements}
				{isEditMode && <FloatingToolbar
					className={'edit-toolbar edit-toolbar-tertiary'}
					display={'block'}
					children={[TextColorToolbarButton({
						currentTextColor: textColor || '',
						onChangeFunction: newColor=>setTertiaryTextColor(newColor)
					}), EditButton(), ClearButton()]}
				/>}
			</TertiaryElement>

		);
	} else {
		return isEditMode ? (
			<TertiaryElement className="addLinks">
				<AddElementButton label="Add Links" onClick={toggleAddLinksModal} />
			</TertiaryElement>
		) : null;
	}
};

export default TertiaryHeaderElement;