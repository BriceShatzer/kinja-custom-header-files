/* @flow */

import * as React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import styled, {css} from 'styled-components';
import media from 'kinja-components/style-utils/media';
import { gridValue } from 'kinja-components/components/grid-utils';
import Notification from 'kinja-components/components/elements/notification';
import CustomHeaderToolbar from 'kinja-components/components/customHeader-toolbar';
import uploadImage from 'kinja-magma/api/uploadImage';
import ImageUploadModal from './ImageUploadModal';
import AddLinksModal from './AddLinksModal';
import SponsorshipBadge from 'kinja-components/components/custom-header/SponsorshipBadge';
import BackgroundToolbar from './BackgroundToolbar';
import PrimaryHeaderElement from './PrimaryHeaderElement';
import SecondaryHeaderElement from './SecondaryHeaderElement';
import TertiaryHeaderElement from  './TertiaryHeaderElement';
import PodcastPlayer from 'kinja-components/components/podcast-player';
import { colors } from '../theme/themes';
import setHeaderBackgroundStyle from './setHeaderBackgroundStyle';
import {
	saveCustomHeaderForCategoryId,
	saveCustomHeaderForStoryTypeId,
	saveCustomHeaderForBlogId,
	saveCustomHeaderForTag
} from 'kinja-magma/api/customHeader';
import {
	type StoryTypeId,
	type CategoryId,
	type BlogId
} from 'kinja-magma/models/Id';
import  { type TagCanonical } from 'kinja-magma/models/Tag';
import {
	type CustomHeaderProps,
	type CustomHeaderRenderProps,
	type CustomHeaderContent,
	type CustomHeaderColor,
	type CustomHeaderImage,
	type CustomHeaderPlainText,
	type CustomHeaderLinks,
	type CustomHeaderLinkObj,
	type BlogCustomHeader,
	type TagCustomHeader
} from 'kinja-magma/models/CustomHeader';
import { type CategoryCustomHeaderResponse, type StoryTypeCustomHeaderResponse} from 'kinja-magma/api/customHeader';

type SaveRespose = Promise<StoryTypeCustomHeaderResponse | CategoryCustomHeaderResponse | BlogCustomHeader | TagCustomHeader | null>;

export type ImageUpdateMethod = (newValue: CustomHeaderImage) => void;

export type State = {
	renderProps: CustomHeaderRenderProps,
	isEditMode: boolean,
	isImageModalOpen: boolean,
	isAddLinksModalOpen: boolean,
	tertiaryTextColor: ?string,
	imageUpdateMethod?: ImageUpdateMethod;
};

export const headerElementWidth = css`
	${media.mediumDown`
		width: 100%;
	`}
	${media.largeOnly`
		width: ${gridValue.large('6c')};
	`}
	${media.xlargeOnly`
		width: ${gridValue.xlarge('6c')};
	`}
	${media.xxlargeUp`
		width: ${gridValue.xxlarge('6c')};
	`}
`;

const hasBackground = (customHeaderRenderProps: CustomHeaderRenderProps) => {
	let value = !!(customHeaderRenderProps && customHeaderRenderProps.content.background);
	if (customHeaderRenderProps && customHeaderRenderProps.content.background &&
        customHeaderRenderProps.content.background.type === 'color') {
		value = customHeaderRenderProps.content.background.value.toUpperCase() !== '#FFFFFF';
	}
	return value;
};

export const updateOverhangOnCustomHeaderPropsChange = (updatedCustomHeaderRenderProps: CustomHeaderRenderProps) => {
	const header = document.querySelector('.overhang-wrapper');
	if (header) {
		if (hasBackground(updatedCustomHeaderRenderProps)) {
			header.classList.add('custom-header-has-background');
		} else {
			header.classList.remove('custom-header-has-background');
		}
	}
};

const CustomContainer = styled.div`
	position: relative;
	min-width: 100vw;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border-top: 1px solid ${props => props.theme.color.lightgray};

	${props => setHeaderBackgroundStyle(props.renderProps.content.background)};
	&:last-child {
		border-bottom-width: 0;
	}
	&.hydrated {
		${props => setPadding(props.renderProps)};
		& > .hydrated { border-top-width: 0; }
	}

	${media.largeUp`
		&.has-curation.has-background {
			padding-bottom: 140px;
		}
	`}

	&.Editor > span { min-height: 34px; }

	.edit-toolbar {
		display: flex;
		align-items: center;
		justify-content: center;
		a {
			padding: 8px;
			line-height: 0;
			color: ${colors.darksmoke};
			text-decoration: none;
			&:hover {
				color: ${colors.primary};
			}
		}
		${media.mediumDown`
			display: none;
		`}
	}

	.edit-toolbar-secondaryElement,
	.edit-toolbar-tertiary,
	.edit-toolbar-background {
		position: absolute;
	}

	.edit-toolbar-secondaryElement,
	.edit-toolbar-tertiary {
		left: calc(1rem + 100%);
		top: 0;
		${media.mediumDown`
			left: unset;
			right: 0;
		`}
	}

	.addLinks {
		${media.mediumDown`
			display: none;
		`}
	}

	.edit-toolbar-background {
		top: 1rem;
		left: 1rem;
		z-index: 100;
	}
	.addElementButton {
		background-color: ${colors.white};
		border: 1px solid ${colors.lightgray};
	}
`;

function setPadding(content: CustomHeaderContent) {
	if (
		(content.secondary && content.secondary.value.length > 0) ||
		(content.tertiary && content.tertiary.value.length > 0)
	) {
		return css`
			padding: 32px 18px;
			& > .hydrated {
				margin: -32px -18px;
			}

			${media.largeUp`
				padding: 48px 18px;
				& > .hydrated {margin: -48px -18px;}
			`}
		`;
	} else {
		return css`
			padding: 24px 18px;
			& > .hydrated { margin: -24px -18px; }
			${media.largeUp`
				padding: 40px 18px;
				& > .hydrated {margin: -40px -18px;}
			`}
		`;
	}
}

function fireNotification(message: string) {
	const notificationElement = document.createElement('div');
	window.document.body.appendChild(notificationElement);
	ReactDOM.render(
		<Notification
			message={message}
			dismissable={true}
			type={'error'}
			fullWidth={false}
		/>,
		notificationElement
	);
}

class CustomHeader extends React.Component<CustomHeaderProps, State> {
	constructor(props: CustomHeaderProps) {
		super(props);

		this.state = {
			renderProps: props.customHeaderRenderProps,
			isEditMode: props.isEditMode,
			isImageModalOpen: false,
			isAddLinksModalOpen: false,
			tertiaryTextColor: (
				props.customHeaderRenderProps.content &&
				props.customHeaderRenderProps.content.tertiary &&
				props.customHeaderRenderProps.content.tertiary.value.length) ?
				props.customHeaderRenderProps.content.tertiary.value[0].color :
				''
		};
	}

	saveCustomHeader = (event?: SyntheticEvent<HTMLButtonElement>): SaveRespose => {
		const {content} = this.state.renderProps;
		if (this.state.renderProps.categoryId) {
			const categoryId = ((this.state.renderProps.categoryId: any): CategoryId);
			const data = { categoryId, content};
			this.toggleEditMode(event);
			return saveCustomHeaderForCategoryId(categoryId, data).catch(
				reason => {
					const msg = reason.message ?
						reason.message :
						'An Issue Occured Saving Custom Header for Category Id';
					fireNotification(msg);
					return Promise.resolve(null);
				}
			);
		} else if (this.state.renderProps.storyTypeId) {
			const storyTypeId = ((this.state.renderProps.storyTypeId: any): StoryTypeId);
			const data = { storyTypeId, content};
			this.toggleEditMode(event);
			return saveCustomHeaderForStoryTypeId(storyTypeId, data).catch(
				reason => {
					const msg = reason.message ?
						reason.message :
						'An Issue Occured Saving Custom Header for StoryType Id';
					fireNotification(msg);
					return Promise.resolve(null);
				}
			);
		} else if (this.state.renderProps.blogId) {
			const blogId = ((this.state.renderProps.blogId: any): BlogId);
			this.toggleEditMode(event);

			if (this.state.renderProps.tagCanonical) {
				// save for tag
				const tagCanonical = ((this.state.renderProps.tagCanonical: any): TagCanonical);
				const data = {tagCanonical, blogId, content};
				return saveCustomHeaderForTag(data).catch(
					reason => {
						const msg = reason.message ?
							reason.message :
							'An Issue Occured Saving Custom Header for tag';
						fireNotification(msg);
						return Promise.resolve(null);
					}
				);
			} else {
				// save for blogId
				const data = {blogId, content};
				return saveCustomHeaderForBlogId(blogId, data).catch(
					reason => {
						const msg = reason.message ?
							reason.message :
							'An Issue Occured Saving Custom Header for Blog Id';
						fireNotification(msg);
						return Promise.resolve(null);
					}
				);
			}
		} else {
			this.toggleEditMode(event);
			return Promise.resolve(null);
		}

	}

	toggleEditMode = (event?: SyntheticEvent<HTMLButtonElement>) => {
		let isOpenButton;
		let isCloseButton;

		if (event) {
			isOpenButton = !!(event.currentTarget instanceof HTMLElement && event.currentTarget.dataset.openbutton === 'true');
			isCloseButton = !!(event.currentTarget instanceof HTMLElement && event.currentTarget.dataset.closebutton === 'true');
		}
		this.setState(prevState => {
			const obj = {
				...prevState,
				// revert to original renderProps on "cancel"
				renderProps: isCloseButton ? this.props.customHeaderRenderProps : prevState.renderProps,
				isEditMode: isOpenButton
			};
			return obj;
		});
	}

	toggleImageModal = (imageUpdateMethod?: ImageUpdateMethod) => {
		if (imageUpdateMethod) {
			return this.setState(prevState => ({
				...prevState,
				isImageModalOpen: !prevState.isImageModalOpen,
				imageUpdateMethod
			}));
		} else {
			return this.setState(prevState => ({
				...prevState,
				isImageModalOpen: !prevState.isImageModalOpen
			}));
		}
	}

	toggleAddLinksModal = () => {
		return this.setState(prevState => ({
			...prevState,
			isAddLinksModalOpen: !prevState.isAddLinksModalOpen
		}));
	}
	setTertiaryTextColor = (color: string) => {
		const {content} = this.state.renderProps;
		const tertiaryContent: ?CustomHeaderLinks = content.tertiary;
		if (// update any exisiting tertiary links
			tertiaryContent &&
			tertiaryContent.value &&
			tertiaryContent.value.length
		) {
			const updatedLinks = tertiaryContent.value.reduce((updatedLinks: Array<CustomHeaderLinkObj>, link: CustomHeaderLinkObj) => {
				link.color = color;
				return updatedLinks.concat([link]);
			}, []);

			this.updateElement({
				target: 'tertiary',
				value: {
					'type': 'links',
					'value': updatedLinks
				}
			});
		}
		return this.setState(prevState=> ({
			...prevState,
			tertiaryTextColor: color
		}));
	}

	updateElement = (updateObject: {
		target: 'primary', value: CustomHeaderPlainText | CustomHeaderImage
	} | {
		target: 'secondary', value: CustomHeaderPlainText
	} | {
		target: 'tertiary', value: CustomHeaderLinks
	} | {
		target: 'background', value: CustomHeaderColor | CustomHeaderImage
	}) => {
		const newValue = {};
		if (updateObject.target === 'primary' &&
			updateObject.value.type === 'plainText' &&
			!updateObject.value.value.length
		) {
			updateObject.value.value = 'Please Provide a Title or Image';
		}
		newValue[`${updateObject.target}`] = updateObject.value;
		const newCustomHeaderRenderProps: CustomHeaderRenderProps = {
			...this.state.renderProps,
			content: {
				...this.state.renderProps.content,
				...newValue
			}
		};
		return this.setState(prevState=> ({
			...prevState,
			renderProps: newCustomHeaderRenderProps
		}));
	}

	componentDidUpdate() {
		updateOverhangOnCustomHeaderPropsChange(this.state.renderProps);

		if (this.props.enableSponsorshipAd) {
			const adSlot = document.querySelector('[data-ad-unit="SECTION_SPONSORSHIP"]');
			adSlot && window && window.BULBS_ELEMENTS_ADS_MANAGER && window.BULBS_ELEMENTS_ADS_MANAGER.reloadAds(adSlot);
		}
	}

	render() {
		return (
			<CustomContainer
				isEditable={this.props.hasEditPermission}
				renderProps={this.state.renderProps}
				className={classnames(
					'hydrated',
					{'Editor': this.state.isEditMode},
					{'has-background': hasBackground(this.state.renderProps)},
					{'has-curation': this.props.hasCuration}
				)}>
				<React.Fragment>
					{ // render SponsorshipBadge only when enabled & on hydration when it can be filled via DFP
						this.props.enableSponsorshipAd &&
						(typeof window !== 'undefined') &&
						(typeof window.BULBS_ELEMENTS_ADS_MANAGER !== 'undefined') &&
						<SponsorshipBadge />
					}
					{PrimaryHeaderElement({
						url: this.props.titleUrl,
						events: this.props.titleEvent,
						primaryElementValue: this.state.renderProps.content.primary,
						isEditMode: this.state.isEditMode,
						toggleImageModal: imageUpdateMethod => this.toggleImageModal(imageUpdateMethod),
						onNewPrimaryValue: (newValue: CustomHeaderPlainText | CustomHeaderImage) => this.updateElement({target: 'primary', value: newValue})
					})}
					{SecondaryHeaderElement({
						secondaryElementValue: this.state.renderProps.content.secondary,
						isEditMode: this.state.isEditMode,
						onNewSecondaryValue: (newValue: CustomHeaderPlainText) => this.updateElement({target: 'secondary', value: newValue})
					})}
					{TertiaryHeaderElement({
						tertiaryElementValue: this.state.renderProps.content.tertiary,
						textColor: this.state.tertiaryTextColor,
						isEditMode: this.state.isEditMode,
						toggleAddLinksModal: ()=>this.toggleAddLinksModal(),
						onNewTertiaryValue: (newValue: CustomHeaderLinks)  => this.updateElement({target: 'tertiary', value: newValue}),
						setTertiaryTextColor: (color: string) => this.setTertiaryTextColor(color)
					})}
					{this.props.showPodcastPlayer && <PodcastPlayer podcastId="SONY6345768755" />}
				</React.Fragment>
				{this.props.hasEditPermission &&
					<CustomHeaderToolbar
						toggleHandler={event=>this.toggleEditMode(event)}
						isEditMode={this.state.isEditMode}
						saveHandler={
							()=>this.saveCustomHeader().then(res => updateOverhangOnCustomHeaderPropsChange(res))
						}
					/>
				}
				{this.props.hasEditPermission && this.state.isEditMode &&
					BackgroundToolbar({
						toggleImageModal: imageUpdateMethod=>this.toggleImageModal(imageUpdateMethod),
						onNewBackgroundValue: (newValue: CustomHeaderColor | CustomHeaderImage)=>{
							this.updateElement({target: 'background', value: newValue});

						}
					})}
				{this.props.hasEditPermission && this.state.isEditMode && this.state.isAddLinksModalOpen &&
					<AddLinksModal
						textColor={this.state.tertiaryTextColor || ''}
						onCancel={()=>this.toggleAddLinksModal()}
						saveLinks={(newLinks: Array<{ text: string, url: string, color: string }>) =>{
							this.updateElement({target: 'tertiary', value: {type: 'links', value: newLinks}});
							this.toggleAddLinksModal();
						}}
						currentLinks={ (this.state.renderProps &&
							this.state.renderProps.content &&
							this.state.renderProps.content.tertiary &&
							this.state.renderProps.content.tertiary.value) ?
							this.state.renderProps.content.tertiary.value : []
						}
					/>
				}
				{this.props.hasEditPermission && this.state.isEditMode && this.state.isImageModalOpen &&
					<ImageUploadModal
						onCancel={()=>this.toggleImageModal()}
						imageUploader={uploadImage}
						onChange={response=>{
							if (response &&
								response.format &&
								response.id &&
								this.state.imageUpdateMethod
							) {
								const customHeaderImage = {
									type: 'image',
									id: response && response.id,
									format: response.format
								};
								this.state.imageUpdateMethod(customHeaderImage);
								this.toggleImageModal();
							}
						}}
					/>
				}
			</CustomContainer>
		);
	}
}

export default CustomHeader;
