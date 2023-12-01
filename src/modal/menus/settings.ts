import { renderGeneralSettings } from "modal/menus/general";
import { renderGraphSettings } from "modal/menus/graph";
import { PlotModal } from "modal/plotModal";
import { renderRasterSettings } from "modal/menus/raster";
import { renderSubmitBtn } from "modal/menus/graph/submit";

export const renderSettings = (el: HTMLElement, modal: PlotModal) => {
	const rasterEl = el.createDiv();
	const generalEl = el.createDiv();
	const menuEl = el.createDiv();
	renderRasterSettings(rasterEl, menuEl, modal);
	renderGeneralSettings(generalEl, modal);
	renderGraphSettings(menuEl, modal);
	renderSubmitBtn(el, modal);
};
