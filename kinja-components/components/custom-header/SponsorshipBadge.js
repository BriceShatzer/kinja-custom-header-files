/* @flow */

import React from 'react';
import styled from 'styled-components';
import { gridValue } from 'kinja-components/components/grid-utils';
import media from 'kinja-components/style-utils/media';
import { SectionSponsorshipAd}  from 'kinja-components/components/ad-slot/ads';


const SponsorshipAdContainer = styled.div`
	padding-top: 12px;
	position: static;
	order: 10;
	
	margin-left: auto;
	margin-right: auto;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	background-color: none !important;
	
	& > img {
		width: 120px;
		height: 60px;
	}

	${media.smallOnly`
		width: ${gridValue.small('6c')};
	`}

	${media.mediumOnly`
		width: ${gridValue.medium('6c')};
	`}
	${media.largeUp`
		width: 100%;
	`}
	${media.largeOnly`
		max-width: ${gridValue.large('12c')};
	`}
	${media.xlargeUp`
		top: 0;
		padding-right: 16px;
		padding-top: 12px;
		position: absolute;
		justify-content: flex-end;
	`}
	${media.xlargeOnly`
		width: ${gridValue.xlarge('12c')};
	`}
	${media.xxlargeUp`
		width: ${gridValue.xxlarge('12c')};
	`}
`;

function SponsorshipBadge() {
	return (
		<SponsorshipAdContainer>
			<SectionSponsorshipAd />
		</SponsorshipAdContainer>
	);
}

// testing fallback placeholder image
// <img src={'https://i.kinja-img.com/gawker-media/image/upload/qromho2pmnxgo4xydow1.png'} />

export default SponsorshipBadge;
