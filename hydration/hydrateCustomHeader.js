// @flow


import ReactDOM from 'react-dom';
import * as React from 'react';
import type Blog from '../../models/Blog';
import { UserProvider, UserConsumer } from '../userContext';
import createLegacyUserModel from './utils/createLegacyUserModel';
import { OpenButton, InitCustomHeaderEditor } from 'kinja-components/components/customHeader-toolbar';
import {
	type CustomHeaderProps,
	type FetchCustomHeaderApiMethod,
	type CustomHeaderRenderProps,
	generateBaseCustomHeaderRenderProps
} from '../../models/CustomHeader';

export default function hydrateCustomHeader({
	blog,
	fetchCustomHeaderApiMethod,
	features,
	customHeaderProps,
	hasCuration
}: {
	blog: Blog,
	fetchCustomHeaderApiMethod: () => FetchCustomHeaderApiMethod,
	features: { [string]: boolean },
	customHeaderProps: ?CustomHeaderProps,
	hasCuration?: boolean
}) {
	const customHeaderInitContainer = document.querySelector('.js_custom-header-toolbar-container');
	let customHeaderEditorContainer = document.querySelector('.js_custom-header-editor-container');

	const loadCustomHeaderModule = fetchCustomHeaderPromise => {
		return Promise.all([
			import(/* webpackChunkName: "customHeader" */ 'kinja-components/components/custom-header'),
			import(/* webpackChunkName: "theme" */ 'kinja-components/components/theme/theme')
		]).then(response => {
			const CustomHeader = response[0].default;
			const Theme = response[1].default;

			if (customHeaderEditorContainer && customHeaderInitContainer) {
				const customHeaderRenderProps: CustomHeaderRenderProps = (() => {
					if (customHeaderProps && customHeaderProps.customHeaderRenderProps) {
						return customHeaderProps.customHeaderRenderProps;
					}
					if (fetchCustomHeaderPromise) {
						fetchCustomHeaderPromise().then(resp=> {
							if (resp && resp.content) {return resp;}
						});
					}
					return generateBaseCustomHeaderRenderProps(blog.id).customHeaderRenderProps;
				})();

				const props: CustomHeaderProps = {
					customHeaderRenderProps,
					hasCuration,
					isEditMode: true,
					hasEditPermission: true,
					fetchCustomHeaderApiMethod: fetchCustomHeaderPromise
				};

				customHeaderEditorContainer = document.querySelector('.js_custom-header-editor-container');
				customHeaderEditorContainer &&
				ReactDOM.render(
					<Theme blog={blog && blog.blogTheme}>
						<CustomHeader {...props}/>
					</Theme>, customHeaderEditorContainer);
			}
		});
	};

	if (customHeaderInitContainer) {
		ReactDOM.hydrate(
			<UserProvider>
				<UserConsumer>
					{({ user, blogs, logout }) => {
						const isLoggedIn = Boolean(user);
						const currentUser = user ? createLegacyUserModel(user, blogs, logout) : {};
						const isSuperuser = currentUser.isSuperuser && features.superuser;
						const roleOnCurrentBlog = currentUser.membership && blog &&
							currentUser.membership.find(blogItem => String(blogItem.blogId) === String(blog.id));
						const isAuthorized = roleOnCurrentBlog && ['AUTHOR', 'ADMIN', 'OWNER'].some(role => roleOnCurrentBlog.hasRole(role));
						const hasPermission = isSuperuser || isAuthorized;
						if (isLoggedIn && hasPermission && blog && blog.isGmgBlog) {
							return (
								<InitCustomHeaderEditor>
									<OpenButton onClick={ event => {
										loadCustomHeaderModule(fetchCustomHeaderApiMethod);
										event && event.currentTarget && event.currentTarget.classList.add('hide');
									}}/>
								</InitCustomHeaderEditor>
							);
						}
					}}
				</UserConsumer>
			</UserProvider>,
			customHeaderInitContainer);
	}
}
