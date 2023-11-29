import { render2DSettings } from "modal/menus/graph/settings2d";
import { render3DSettings } from "modal/menus/graph/settings3d";
import { PlotModal } from "modal/plotModal";
import { Setting } from "obsidian";

export const renderGraphSettings = (el: HTMLElement, modal: PlotModal) => {
	el.innerHTML = "";
	el.createEl("h5", { text: `Plot ${modal.settings.raster.type}` });
	if (modal.settings.raster.type === "2D") render2DSettings(el, modal);
	else render3DSettings(el, modal);

	new Setting(el).addButton((btn) =>
		btn
			.setButtonText("Submit")
			.setCta()
			.onClick(async () => {
				modal.close();
				const line = modal.editor.getCursor().line;
				modal.editor.setLine(
					line,
					`\`\`\`plot-mathematica \n${JSON.stringify(
						modal.settings,
						null,
						4
					)} \n\`\`\``
				);
			})
	);
};
