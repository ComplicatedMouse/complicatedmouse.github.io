/*
 * Region-specific strings that are used in the JavaScript
 */
var LocaleString = function() {};

//
LocaleString.lcStrMessageNeedJQuery = "jQuery is required in order to execute scripts.";
LocaleString.lcStrMessageNothingToc = "The TOC data file (" + TemplateSettings.templateTocFileName + ") has incorrect content.";

// 
LocaleString.lcStrLabelModeAll  = "All";
LocaleString.lcStrLabelModeDesc = "Backgrounders Only";
LocaleString.lcStrLabelModeItem = "Guideline Items Only";

// Package Selection
LocaleString.lcStrLabelExcludeByFramework = "Compliance with this item is built into {package}.";
LocaleString.lcStrLabelExcludeByUnsupport = "This feature is not available with {package}.";
LocaleString.lcStrLabelExcludeByStandard = "This item does not apply to {package}.";

LocaleString.lcStrLabelExclude = {
    "F" : [LocaleString.lcStrLabelExcludeByFramework, false],
    "U" : [LocaleString.lcStrLabelExcludeByUnsupport, false],
    "S" : [LocaleString.lcStrLabelExcludeByStandard, false],
    "D" : ["This item is planned to be removed in future.", false],
    "V" : ["", true]
};

// Title for printable page display settings
LocaleString.lcStrLabelPrintSetting = "Printable Page Display Settings";
// ToolTip for printable page display settings
LocaleString.lcStrLabelPrintSettingToolTip = "Before printing, go to Page Setup in your browser's print settings and select to print background colors and images.";
// Alert when generating printable page
LocaleString.lcStrAlertGoPrintPage = "It may take some time for the page to be displayed.";
// Default of printable page selector
LocaleString.lcStrLabelSelectChapter = "-- Output selected content on one page --";
// Output all pages for the printable page selector
LocaleString.lcStrLabelSelectAll     = "(All)";

// Figure and table numbering prefixes
LocaleString.lcStrLabelFigure = "Figure ";
LocaleString.lcStrLabelTable = "Table ";
LocaleString.lcStrLabelCode = "Code ";

// Link created at the top of the auto-generated TOC
LocaleString.lcStrLabelAcTopLevel = "(To top of page)";

// Search Page
LocaleString.lcStrMessageSearching = "Searching. Please wait...";
LocaleString.lcStrLabelSearchResult = "Search results: %r% hits ";
LocaleString.lcStrLabelSearchView = "(Displaying hits %s% - %e%)";
LocaleString.lcStrLabelSearchPrev = "Display previous %c% hits";
LocaleString.lcStrLabelSearchNext = "Display next %c% hits";

// Search button
LocaleString.lcStrLabelStartSearch = "Search";

// Guideline item names
LocaleString.lcStrLabelDefinition = "Guideline Item";
LocaleString.lcStrLabelTestMethod = "Test Method";
LocaleString.lcStrLabelCriterion = "Pass/Fail Determination";
LocaleString.lcStrLabelTestObject = "Software to Be Tested";
LocaleString.lcStrLabelExclusion = "Exceptions";
LocaleString.lcStrLabelRemarks = "Notes";

LocaleString.lcStrOpenDescendants = "Hold down the CTRL key and click to expand all.";
LocaleString.lcStrOpenViewer = "Click to zoom in.";
LocaleString.lcStrLinkJump = "Click to follow link.";

LocaleString.lcStrTopPageName = "Title Sheet";


// Confirmation Messages for Chrome
LocaleString.lcStrAlertPrintPageByChrome = "When local HTML files are open in Google Chrome, you might encounter a situation where the printable page is not displayed correctly.";
LocaleString.lcStrConfirmDownloadByChrome = "When local HTML files are open in Google Chrome, you might encounter a situation where downloads do not occur correctly. \nDo you still want to download?";

// Related link
LocaleString.lcStrRelatedLinks = "Related link";

// Permalink
LocaleString.lcStrPermalink = "Link to this heading";

// For Guidelines
LocaleString.lcStrTitlePicker = "Click title strings to select them.";

// Expand all / Collapse all
LocaleString.lcStrTitleOpenAll = "Expand all";
LocaleString.lcStrTitleCloseAll = "Collapse all";
/*
//DOCSTD-681
LocaleString.lcStrChangeLanguage = "Change language";
*/
