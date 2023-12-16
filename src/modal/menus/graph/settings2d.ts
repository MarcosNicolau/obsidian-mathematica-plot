import { RenderSettings } from "modal/menus/graph";
import {
	OptionsFields,
	renderIntervalForm,
	renderOptions,
} from "modal/menus/graph/helpers";
import { Setting } from "obsidian";
import {
	ContourPlot,
	ParametricPlot,
	Plot,
	RegionPlot,
	VectorPlot,
} from "types/plot";

export const renderPlotSettings = (el: HTMLElement, graph: Plot) => {
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
	graph: ParametricPlot
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
	graph: RegionPlot
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

export const renderContourPlotSettings = (
	el: HTMLElement,
	graph: ContourPlot
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

export const renderVectorPlotSettings = (
	el: HTMLElement,
	graph: VectorPlot
) => {
	new Setting(el.createDiv()).setName("Vx(x,y) = ").addTextArea((component) =>
		component.setValue(graph.components[0]).onChange((value) => {
			graph.components[0] = value;
		})
	);
	new Setting(el.createDiv()).setName("Vy(x,y) = ").addTextArea((component) =>
		component.setValue(graph.components[1]).onChange((value) => {
			graph.components[1] = value;
		})
	);
	renderIntervalForm(el, "x", graph.domain.x);
	renderIntervalForm(el, "y", graph.domain.y);
};

export const optsFields2D: OptionsFields = {
	plotLabels: {
		name: "Plot Labels",
		desc: "Labels to use for fields",
	},
	plotLegends: {
		name: "Plot Legends",
		desc: "Legends for fields",
	},
	plotStyle: {
		name: "Plot Style",
		desc: "Graphics directives to specify the style for each field",
	},
	filling: {
		name: "Filling",
		desc: "Filling to insert under each field",
	},
	fillingStyle: {
		name: "Filling Style",
		desc: "Style to use for filling ",
	},
};

export const renders2D: RenderSettings = {
	renderSettings: {
		plot: renderPlotSettings,
		parametricPlot: renderParametricPlotSettings,
		regionPlot: renderRegionPlotSettings,
		contourPlot: renderContourPlotSettings,
		vectorPlot: renderVectorPlotSettings,
	},
	renderOptions: renderOptions(optsFields2D),
};
