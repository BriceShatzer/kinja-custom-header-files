/* @flow */
import styled from 'styled-components';
import * as React from 'react';
import TextColorDark from 'kinja-components/components/icon19/TextColorDark';

const TextColorButtonElement = styled.label`
	position: relative;
	a {
		color: ${props => (props.textColor ? props.textColor : props.theme.color.darksmoke)} !important;

		span {
			padding: 2px;
			border: 1px solid ${props => props.theme.color.darksmoke};
			svg {
				max-height: 14px;
				max-width: 14px;
				filter: drop-shadow(0 0 1px #888);
				/* light shadow to allow for very light text colors to still show up */
			}
		}
	}

	input {
		cursor: pointer;
		position: absolute;
		opacity: 0;
	}
`;

const TextColorToolbarButton = ({
	currentTextColor,
	onChangeFunction
}: {
    currentTextColor: string,
	onChangeFunction: (newColor: string) => void
}
) => {
	return (
		<TextColorButtonElement textColor={currentTextColor}>
			<a title={'Update Text Color'}>
				<React.Fragment>
					<TextColorDark/>
					<input
						type="color"
						value={currentTextColor}
						onChange={(event: SyntheticEvent<HTMLInputElement>) => {
							const newColor = event.currentTarget.value;
							onChangeFunction(newColor);
						}}
					/>
				</React.Fragment>
			</a>
		</TextColorButtonElement>);
};

export default TextColorToolbarButton;