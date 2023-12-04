import { PlotModal } from "modal/plotModal";
import { Setting, stringifyYaml } from "obsidian";
import { PlotSettings } from "types/plot";

// This functions removes all the unnecessary fields from the settings so that the editor has less visual clutter
const cleanSettingStructure = (settings: PlotSettings) => {
	const cleanGraphs = settings.graphs.map((graph) => ({
		id: graph.id,
		options: graph.options,
		type: graph.type,
		[graph.type]: graph[graph.type],
	}));
	return { ...settings, graphs: cleanGraphs };
};

export const renderSubmitBtn = (el: HTMLElement, modal: PlotModal) => {
	new Setting(el).addButton((btn) =>
		btn
			.setButtonText("Submit")
			.setCta()
			.onClick(async () => {
				modal.close();
				const line = modal.editor.getCursor().line;
				modal.editor.setLine(
					line,
					`\`\`\`plot-mathematica \n${stringifyYaml(
						cleanSettingStructure(modal.settings)
					)}\`\`\``
				);
			})
	);
};