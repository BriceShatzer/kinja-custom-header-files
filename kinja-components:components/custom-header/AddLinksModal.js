// @flow

import React from 'react';
import styled from 'styled-components';
import Modal from '../modal';
import Textfield18, { KinjaTextFieldWrapper } from '../form/textfield18';
import Trashcan from 'kinja-components/components/icon19/Trashcan';
import Button19 from '../button19';
import AddElementButton from './AddElementButton';

import { type CustomHeaderLinkObj } from 'kinja-magma/models/CustomHeader';

type Props = {
	onCancel: () => void,
	saveLinks: (newLinks: Array<CustomHeaderLinkObj>) => void,
	currentLinks: Array<CustomHeaderLinkObj>,
	textColor: ?string
};
type State = {links: Array<CustomHeaderLinkObj>}

const ModalWrapper = styled.div`
	& > div:first-of-type {
		min-width: 50vw;
		max-height: calc(95vh - 60px);
		overflow: scroll;
		justify-content: space-between;
		align-items: stretch;

		& > div {
			h3 + button { margin-top: 32px; }
			& > div {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				min-height: 320px; /* min-height of modal */
				& > button {
					margin-bottom: 32px;
				}
			}
			&:nth-child(1) { /* Close button */
				/* matches modal padding */
				top: 20px;
				right: 20px;
			}
		}
	}
`;

const ItemWrapper = styled.div`
	display: flex;
	width: 100%;

	align-items: center;
	margin-bottom: 32px;
	border-bottom: 1px dashed ${props => props.theme.color.midgray};

	&:nth-of-type(4) {
		border-bottom-width: 0;
	}
`;

const TextFieldsWrapper = styled(KinjaTextFieldWrapper)`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
`;
const SaveCancelButtons = styled.div`
	border-top: 1px solid ${props => props.theme.color.midgray};
	display: flex;
	justify-content: center;
	min-width: 100%;
	margin: 0 -40px;
	& > button {
		margin-top: 20px;
		margin-left: 10px;
		margin-right: 10px;
	}
`;
const RemoveButtonComponent = styled(Button19)`
	margin-left: 32px;
`;
const RemoveButton = (props: {onClick: () => void }) => (
	<RemoveButtonComponent
		onClick={props.onClick}
		weight='tertiary'
		icon={<Trashcan />}
	/>
);
const AddNewItemButton = (props: {onClick: () => void }) => (
	<AddElementButton label='Add Another' onClick={props.onClick} />
);
const SaveItemsButton = (props: {onClick: () => void, disabled: boolean }) => (
	<Button19
		onClick={props.onClick}
		label='Save'
		disabled={props.disabled}
	/>
);
const CancelButton = (props: {onClick: () => void }) => (
	<Button19
		onClick={props.onClick}
		variant='secondary'
		label='Cancel'
	/>
);
const isValidUrl = string => {
	try { new URL(string); return true; } catch (_) { return false; }
};


class FieldThatRequiresValue extends React.PureComponent<{
	name: string,
	value: string,
	label: string,
	inlineHelp: string,
	onChange: (value: ?string) => Function | void,

}, { error: string }> {
	onChange: () => void;

	state = {};

	constructor(props) {
		super(props);

		this.state.error = '';
		this.onChange = this.onChange.bind(this);
	}

	onChange(value) {
		const invalid  = (value.length > 0) ? '' : 'Please enter a value';

		this.setState({
			error: invalid
		});
		this.props.onChange(value);
	}

	render() {
		return (
			<Textfield18
				name={this.props.name}
				label={this.props.label}
				inlineHelp={this.props.inlineHelp}
				onChange={this.onChange}
				error={this.state.error}
				value={this.props.value}
			/>
		);
	}
}

class AddLinksModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {links: props.currentLinks};
	}
	textColor = this.props.textColor ? this.props.textColor : ''
	updateLink = ({index, name, newValue}: {index: number, name: string, newValue: string}) => {
		const updatedLink = (name.includes('text')) ?
			{text: newValue, url: this.state.links[index].url, color: this.textColor} :
			{text: this.state.links[index].text, url: newValue, color: this.textColor};
		const newLinks = [...this.state.links.slice(0, index), updatedLink, ...this.state.links.slice(index + 1)];
		this.setState({links: newLinks});
	}
	renderLinkFields = () => {
		let fakeIndex = 1;
		const key = ()=>{return fakeIndex += 1;}; // flow is fun...
		return (
			this.state.links.map<TextFieldsWrapper>((link, index) => (
				<ItemWrapper key={`${key().toString()}_link.text`}>
					<TextFieldsWrapper>
						<React.Fragment>
							<FieldThatRequiresValue
								name={`link_${index}_text`}
								label={'Link Label'}
								value={link.text}
								inlineHelp={'Type Here'}
								onChange={value => value &&
									this.updateLink({
										index,
										name: `link_${index}_text`,
										newValue: value })
								}
							/>
							<FieldThatRequiresValue
								name={`link_${index}_url`}
								label={'Link URL'}
								value={link.url}
								inlineHelp={'Type Here'}
								onChange={value => value && this.updateLink({
									index,
									name: `link_${index}_url`,
									newValue: value })}
							/>
						</React.Fragment>
					</TextFieldsWrapper>
					<RemoveButton onClick={()=>{
						const links = [...this.state.links.slice(0, index), ...this.state.links.slice(index + 1)];
						this.setState({links});
					}}/>
				</ItemWrapper>
			))
		);
	}

	render() {
		const isValidToSave = () => {
			return this.state.links.every(linkObj=>{
				return typeof linkObj.text === 'string' &&
				typeof linkObj.url === 'string' &&
				linkObj.text.length > 0 &&
				linkObj.url.length > 0 &&
				isValidUrl(linkObj.url);
			});
		};
		return (
			<ModalWrapper>
				<Modal isOpen onClose={this.props.onCancel} scrollable transparent>
					<React.Fragment>
						<h3>Add Links To Header</h3>
						<React.Fragment>
							{this.renderLinkFields()}
						</React.Fragment>
						{this.state.links.length < 4 &&
						<AddNewItemButton
							onClick={()=> {
								const links = this.state.links.map(link=>{return ({text: link.text, url: link.url, color: this.textColor});});
								links.push({url: '',text: '', color: this.textColor});
								this.setState({links});
							}}
						/>}
						<SaveCancelButtons>
							<React.Fragment>
								<CancelButton onClick={this.props.onCancel} />
								<SaveItemsButton disabled={!isValidToSave()} onClick={()=>this.props.saveLinks(this.state.links)} />
							</React.Fragment>
						</SaveCancelButtons>
					</React.Fragment>
				</Modal>
			</ModalWrapper>
		);
	}
}



export default AddLinksModal;
