import { PlotModal } from "modal/plotModal";
import { Setting, stringifyYaml } from "obsidian";
import { Graph2D, Graph3D, PlotSettings } from "types/plot";

// This functions removes all the unnecessary fields from the settings so that the editor has less visual clutter
const cleanSettingStructure = (settings: PlotSettings): PlotSettings => {
	const cleanGraphs = settings.graphs.map<Graph2D | Graph3D>((graph) => {
		if (graph.type === "plot")
			return {
				type: graph.type,
				id: graph.id,
				expression: graph.expression,
				plotRange: graph.plotRange,
				options: graph.options,
			};
		if (graph.type === "parametricPlot")
			return {
				type: graph.type,
				id: graph.id,
				components: graph.components,
				domain: graph.domain,
				options: graph.options,
			};
	});
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
