// @flow

import React from 'react';
import Modal from '../modal';
import styled from 'styled-components';
import ImageUpload from '../form/image-upload/image-upload';
import { type Image } from '../types';

type Props = {
	onCancel: () => void,
	onChange: (Image) => void,
	imageUploader: (image: string | File) => Promise<*>,

};

const StyleWrapper = styled.span`
	.show-for-small-only { display: none; }
	.show-for-medium-up { display: block; }
`;


const ImageUploadModal = (props: Props) =>
	<Modal isOpen onClose={props.onCancel} scrollable>
		<StyleWrapper>
			<ImageUpload
				imageUploader={props.imageUploader}
				onChange={props.onChange}
				language='en'
			/>
		</StyleWrapper>
	</Modal>;

export default ImageUploadModal;