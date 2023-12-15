import { PlotModal } from "modal/plotModal";
import { Setting } from "obsidian";
import { RasterizeSettings } from "types/plot";
import { renderGraphSettings } from "modal/menus";

export const renderRasterSettings = (
	el: HTMLElement,
	graphSettingsEl: HTMLElement,
	modal: PlotModal
) => {
	const settings = modal.settings;
	el.createEl("h5", { text: "Raster settings" });
	new Setting(el).setName("Dimensions").addDropdown((component) => {
		component.addOptions({
			"2D": "2D",
			"3D": "3D",
		});
		component.onChange((value: RasterizeSettings["dim"]) => {
			settings.raster.dim = value;
			renderGraphSettings(graphSettingsEl, modal);
		});
		component.setValue(settings.raster.dim);
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
				.setValue(settings.raster.size.height)
				.onChange((value) => (settings.raster.size.height = value))
		)
		.setName("Height");
	new Setting(el.createDiv())
		.addText((text) =>
			text
				.setValue(settings.raster.size.width)
				.onChange((value) => (settings.raster.size.width = value))
		)
		.setName("Width");
};
