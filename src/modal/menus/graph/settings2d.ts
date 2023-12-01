import {
	OptionsFields,
	renderIntervalForm,
	renderOptions,
} from "modal/menus/graph/helpers";
import { Setting } from "obsidian";
import { Graph2D, ParametricPlot2D, Plot2D, RegionPlot2D } from "types/plot";

export const defaultGraph = (
	id: string
): Graph2D & Plot2D & ParametricPlot2D & RegionPlot2D => ({
	type: "plot",
	id,
	expression: "",
	plotRange: { x: { min: "", max: "" } },
	options: {},
	components: [],
	domain: {
		u: { min: "", max: "" },
		x: { min: "", max: "" },
		y: { min: "", max: "" },
	},
});

export const renderPlotSettings = (el: HTMLElement, graph: Plot2D) => {
	new Setting(el.createDiv())
		.setName("f(x) = ")
		.setDesc("You can also provide a list of functions {f1, f2, ...}")
		.addTextArea((component) =>
			component.setValue(graph.expression).onChange((value) => {
				graph.expression = value;
			})
		);

	renderIntervalForm(el, "x", graph.plotRange.x);
};

export const renderParametricPlotSettings = (
	el: HTMLElement,
	graph: ParametricPlot2D
) => {
	new Setting(el.createDiv()).setName("g1(u) = ").addTextArea((component) =>
		component.setValue(graph.components[0]).onChange((value) => {
			graph.components[0] = value;
		})
	);
	new Setting(el.createDiv()).setName("g2(u) = ").addTextArea((component) =>
		component.setValue(graph.components[1]).onChange((value) => {
			graph.components[1] = value;
		})
	);
	renderIntervalForm(el, "u", graph.domain.u);
};

export const renderRegionPlotSettings = (
	el: HTMLElement,
	graph: RegionPlot2D
) => {
	new Setting(el.createDiv())
		.setName("expression (x,y)")
		.setDesc("You can also provide a list of expressions {e1, e2, ...}")
		.addTextArea((component) =>
			component.setValue(graph.expression).onChange((value) => {
				graph.expression = value;
			})
		);
	renderIntervalForm(el, "x", graph.domain.x);
	renderIntervalForm(el, "y", graph.domain.y);
};

const optsFields: OptionsFields = {
	plotLabels: "Plot Labels",
	plotLegends: "Plot Legends",
	plotStyle: "Plot Style",
	filling: "Filling",
	fillingStyle: "Filling Style",
};

export const renders2D = {
	defaultGraph,
	renderPlotSettings,
	renderParametricPlotSettings,
	renderRegionPlotSettings,
	renderOptions: renderOptions(optsFields),
};
