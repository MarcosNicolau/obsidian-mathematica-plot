import { renderGeneralSettings } from "../menus/general";
import { renderGraphSettings } from "../menus/graph";
import { PlotModal } from "../plotModal";
import { renderRasterSettings } from "../menus/raster";
import { renderSubmitBtn } from "../menus/graph/submit";

export const renderSettings = (el: HTMLElement, modal: PlotModal) => {
	const rasterEl = el.createDiv();
	const generalEl = el.createDiv();
	const menuEl = el.createDiv();
	renderRasterSettings(rasterEl, menuEl, modal);
	renderGeneralSettings(generalEl, modal);
	renderGraphSettings(menuEl, modal);
	renderSubmitBtn(el, modal);
};
