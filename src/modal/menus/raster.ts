import { displayGraphSettings } from "modal/menus/graphs";
import { PlotModal } from "modal/plotModal";
import { Setting } from "obsidian";
import { RasterizeSettings } from "types/plot";

export const displayRasterSettings = (el: HTMLElement, modal: PlotModal) => {
	const settings = modal.settings;
	el.createEl("h5", { text: "Raster settings" });
	new Setting(el).setName("Type").addDropdown((component) => {
		component.addOptions({
			"2D": "2D",
			"3D": "3D",
		});
		component.onChange((value: RasterizeSettings["type"]) => {
			settings.raster.type = value;
			displayGraphSettings(menuEl, modal);
		});
	});
	new Setting(el.createDiv())
		.addText((text) =>
			text
				.setValue(settings.raster.background)
				.onChange((value) => (settings.raster.background = value))
		)
		.setName("Background");
	new Setting(el.createDiv())
		.addText((text) =>
			text
				.setValue(settings.raster.dimensions.height)
				.onChange(
					(value) => (settings.raster.dimensions.height = value)
				)
		)
		.setName("Height");
	new Setting(el.createDiv())
		.addText((text) =>
			text
				.setValue(settings.raster.dimensions.width)
				.onChange((value) => (settings.raster.dimensions.width = value))
		)
		.setName("Width");
	const menuEl = el.createDiv();
	displayGraphSettings(menuEl, modal);
};
