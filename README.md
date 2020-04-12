**Kinja Custom Header files**

<!-- To read a more comprehensive writeup & explanation, please visit [case study](https://briceshatzer.com/blog/2019-12-19-Kinja-Custom-Header-Case-Study)-->

General notes: 
- Uses [Flow](https://flow.org/)  
- Built with [styled components](https://styled-components.com/)


The whole application is written in Isomorphic JavaScript, with the page intially being constructed shown in the snippets below. 

On page load, `hydrateCustomHeader()` is then called to intialize all of the edit functionality, if required. 


```js
// --- standard-kinja-layout.js ---

function StandardKinjaLayout(props: Props) {
// ... 
return (
    <LayoutProvider blog={blog} features={features}>
        <React.Fragment>
            <TopBarContainer className="js_topbar">
                <StaticTopbar
                    blogName={blog && blog.name}
                    wideRail={features.wide_rail}
                />
            </TopBarContainer>
            <OverhangWrapper
                className={classnames(
                    'overhang-wrapper',
                    customHeaderHasBackground ? 'custom-header-has-background' : '',
                    hangableCuration ? 'hangable-curation' : ''
                )}
            >
                {sectionHeader}
                <InitWrappers className='initWrappers'>
                    <React.Fragment>
                        {initCustomHeader && <CustomHeaderInitWrapper className="js_custom-header-toolbar-container" />}
                        {!isUncategorizedCategory && <CurationInitWrapper className="js_curation-toolbar-container" />}
                    </React.Fragment>
                </InitWrappers>
// ... 
```  

```js
// --- kinja-components/components/header/header.js ---

const HeaderContainer = ({
    // ...
})=>{
    // ...
    const HeaderBar = showHeaderBar ? (
		<CustomHeaderSecondaryContainer className='js_custom-header-editor-container'>
			<CustomHeader
				titleEvent={SubtitleClickEvent}
				titleUrl={subTitleUrl}
				showPodcastPlayer={shouldDisplayPodcastPlayer}
				hasCuration={hasCuration}
				{...headerProps}
			/>
		</CustomHeaderSecondaryContainer>
	) : null;
    // ...
    return (
        // ... 
		<ScrollListener>
			{({childrenRef, secondaryRef, showScrollback}) =>
				<Container ref={childrenRef} isOpen={isOpen} className={cx('js_header-container', {open: isOpen})}>
                    // ...
					<GlobalNav isOpen={isOpen} className={cx('js_global-nav', {open: isOpen})}>
						<CoreNav wideRail={features.wide_rail}>
                            // ...
						</CoreNav>
						<div className="header-bar">
							{HeaderBar && React.cloneElement(HeaderBar, { ref: secondaryRef}) }
						</div>
					</GlobalNav>
// ...
```